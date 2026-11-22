import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@store/ReduxHooks';
import { isTokenExpired } from '@store/slice/AuthSlice';

const ProtectedRoute = () => {
  const location = useLocation();
  const { jwtToken, exp, status } = useAppSelector(state => state.Auth);
  const isAuthenticated = status === 'success' && Boolean(jwtToken) && !isTokenExpired(exp);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
