
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAdmin?: boolean;
  requiresStudent?: boolean;
  requiresProcessing?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiresAdmin = false, 
  requiresStudent = false,
  requiresProcessing = false 
}: ProtectedRouteProps) => {
  // Authentication checks removed - always render children
  return <>{children}</>;
};

export default ProtectedRoute;
