import { Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
  isPublic?: boolean;
}

function AuthGuard({ isPublic = false }: AuthGuardProps) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isLoggedIn = user.email && user.password;

  if (isPublic && isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  if (!isPublic && !isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}

export default AuthGuard;
