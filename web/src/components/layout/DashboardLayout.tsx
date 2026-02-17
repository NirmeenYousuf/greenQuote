import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { UserType } from '../../pages/User/types';

const DashboardLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.get('/logout');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

  const isUser = user?.userType === UserType.user;
  const isAdmin = user?.userType === UserType.admin;

  const currentTab = location.pathname.includes('quotes') ? 1 : 0;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Admin Navigation */}
          {isAdmin && (
            <Button color="inherit" onClick={() => navigate('/admin/quotes')}>
              Quotes
            </Button>
          )}

          {/* User Navigation */}
          {isUser && (
            <Tabs
              value={currentTab}
              textColor="inherit"
              indicatorColor="secondary">
              <Tab
                label="Get Quote"
                onClick={() => navigate('/user/get-quote')}
              />
              <Tab label="Quotes" onClick={() => navigate('/user/quotes')} />
            </Tabs>
          )}

          <Box sx={{ ml: 3 }}>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Outlet />
      </Box>
    </>
  );
};

export default DashboardLayout;
