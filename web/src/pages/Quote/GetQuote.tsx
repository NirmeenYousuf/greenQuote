import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quoteSchema } from './validationSchemas';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const GetQuote = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [form, setForm] = useState<any>({
    fullname: user?.name || '',
    email: user?.email || '',
    address: '',
    monthlyConsumptionKwh: '',
    systemSizeKw: '',
    downPayment: ''
  });

  useEffect(() => {
    if (user) {
      setForm((prev: any) => ({
        ...prev,
        fullname: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const { error } = quoteSchema.validate(form, {
      abortEarly: false
    });

    if (!error) return null;

    const errObj: Record<string, string> = {};
    error.details.forEach((d) => {
      errObj[d.path[0] as string] = d.message;
    });
    return errObj;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        address: form.address,
        monthlyConsumptionKwh: form.monthlyConsumptionKwh,
        systemSizeKw: form.systemSizeKw,
        downPayment: form.downPayment || 0
      };

      const res = await api.post('/quotes', payload);
      toast.success('Quote created successfully');
      navigate(`/quote/${res.data.quote.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create quote');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" mb={2}>
        Get Quote
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Full Name"
          value={form.fullname}
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
          error={!!errors.fullname}
          helperText={errors.fullname}
        />

        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          error={!!errors.address}
          helperText={errors.address}
        />

        <TextField
          label="Monthly Consumption (KWH)"
          type="number"
          value={form.monthlyConsumptionKwh}
          onChange={(e) =>
            setForm({
              ...form,
              monthlyConsumptionKwh: Number(e.target.value)
            })
          }
          error={!!errors.monthlyConsumptionKwh}
          helperText={errors.monthlyConsumptionKwh}
        />

        <TextField
          label="System Size (KW)"
          type="number"
          value={form.systemSizeKw}
          onChange={(e) =>
            setForm({
              ...form,
              systemSizeKw: Number(e.target.value)
            })
          }
          error={!!errors.systemSizeKw}
          helperText={errors.systemSizeKw}
        />

        <TextField
          label="Down Payment (Optional)"
          type="number"
          value={form.downPayment}
          onChange={(e) =>
            setForm({
              ...form,
              downPayment: Number(e.target.value)
            })
          }
        />

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default GetQuote;
