
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuth(isAuth);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
