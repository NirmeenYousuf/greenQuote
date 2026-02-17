import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserType } from '../../pages/User/types';

interface Props {
  children: JSX.Element;
  userType?: UserType;
}

const ProtectedRoute = ({ children, userType }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (userType && user.userType !== userType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
