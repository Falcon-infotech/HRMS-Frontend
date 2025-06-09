import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'hr' | 'employee';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRole
}) => {
  const { isAuthenticated, user } = useSelector((state:RootState)=>state.auth);
  const location = useLocation();
  // console.log(user?.role)

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 if (requiredRole && !requiredRole.includes(user?.role)) {
  return <Navigate to="/home" replace />;
}
  // if (requiredRole && user?.role !== requiredRole) {
  //   // If role doesn't match, redirect to dashboard
  //   return <Navigate to="/home" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;