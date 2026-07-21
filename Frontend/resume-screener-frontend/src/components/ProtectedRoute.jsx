import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Wrong role tried to access — send them to their own home
    return <Navigate to={user?.role === 'Recruiter' ? '/' : '/jobs'} replace />;
    //                                                    👆 fixed
  }

  return children;
}