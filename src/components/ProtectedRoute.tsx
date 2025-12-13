import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};