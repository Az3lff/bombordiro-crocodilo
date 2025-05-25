import { useUnit } from 'effector-react';
import { Navigate, Outlet } from 'react-router-dom';
import { $isAuthenticated, $isAdmin } from '../../Entities/session';
import { $currentMap } from '../../Entities/maps/current-map-store';

export const ProtectedRoute = () => {
  const { isAuth, isAdmin } = useUnit({
    isAuth: $isAuthenticated,
    isAdmin: $isAdmin
  });

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin-panel" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const isAdmin = useUnit($isAdmin);

  if (!isAdmin) {
    return <Navigate to="/lesson-selection" replace />;
  }

  return <Outlet />;
};

export const SceneRoute = () => {
  const currentMap = useUnit($currentMap)

  if (!currentMap) {
    return <Navigate to="/lesson-selection" replace />;
  }
  return <Outlet />
}