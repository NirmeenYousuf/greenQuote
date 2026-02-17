import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import AdminQuotesList from './pages/Quote/AdminQuotes';
import GetQuote from './pages/Quote/GetQuote';
import UserQuotes from './pages/Quote/UserQuotes';
import QuoteDetails from './pages/Quote/QuoteDetails';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { UserType } from './pages/User/types';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
      {/* Admin */}
      <Route
        path="/admin/quotes"
        element={
          <ProtectedRoute userType={UserType.admin}>
            <AdminQuotesList />
          </ProtectedRoute>
        }
      />

      {/* User */}
      <Route
        path="/user/get-quote"
        element={
          <ProtectedRoute userType={UserType.user}>
            <GetQuote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/quotes"
        element={
          <ProtectedRoute userType={UserType.user}>
            <UserQuotes />
          </ProtectedRoute>
        }
      />

      {/* Shared */}
      <Route path="/quote/:id" element={<QuoteDetails />} />
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
