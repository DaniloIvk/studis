import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../core/context/AuthContext';

interface AuthGuardProps {
  isPublic?: boolean;
}

function AuthGuard({ isPublic = false }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex item-center justify-center min-h-screen">
        <div className='text-lg'>Loading..</div>
      </div>
    )
  }

  const isLoggedIn = !!user;

  if (isPublic && isLoggedIn) {
    // return <Navigate to='/' replace />;
  }

  if (!isPublic && !isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}

export default AuthGuard;
