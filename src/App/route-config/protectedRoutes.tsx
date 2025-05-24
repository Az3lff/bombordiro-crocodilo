import { useUnit } from 'effector-react';
import { Navigate, Outlet } from 'react-router-dom';
import { $isAuthenticated, $isAdmin } from '../../Entities/session';

export const ProtectedRoute = () => {
  const isAuth = useUnit($isAuthenticated);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const isAdmin = useUnit($isAdmin);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
