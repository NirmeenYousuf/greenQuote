import { useState } from 'react';
import { Container, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { registerSchema } from './validationSchemas';
import { RegisterPayload } from './types';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const { error } = registerSchema.validate(form, { abortEarly: false });
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
      await api.post('/register', form);
      toast.success('Registered successfully');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name"
          value={form.name}
          error={!!errors.name}
          helperText={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Email"
          value={form.email}
          error={!!errors.email}
          helperText={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          error={!!errors.password}
          helperText={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
