import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOperations?: boolean;
  requireManager?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireOperations = false, 
  requireManager = false 
}: ProtectedRouteProps) {
  const { isOperations, isManager } = useAuthStore();

  if (requireOperations && !isOperations()) {
    return <Navigate to="/" replace />;
  }

  if (requireManager && !isManager() && !isOperations()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}