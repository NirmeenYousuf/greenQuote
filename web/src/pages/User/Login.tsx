import { useState } from 'react';
import { Container, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { loginSchema } from './validationSchemas';
import { LoginPayload, LoginResponse, UserType } from './types';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setUser } = useAuth();

  const validate = () => {
    const { error } = loginSchema.validate(form, { abortEarly: false });
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
      const res = await api.post<LoginResponse>('/login', form);
      setUser(res.data);
      toast.success('Login successful');
      if (res.data.userType === UserType.admin) navigate('/admin/quotes');
      else navigate('/user/get-quote');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} display="flex" flexDirection="column" gap={2}>
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
          Sign In
        </Button>

        <Button onClick={() => navigate('/register')}>Register</Button>
      </Box>
    </Container>
  );
};

export default Login;
