
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        setAuth(isAuth);
        
        if (!isAuth) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin area",
            variant: "destructive",
          });
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setAuth(false);
        toast({
          title: "Authentication error",
          description: "There was a problem verifying your credentials",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Verifying your credentials...</p>
      </div>
    );
  }

  if (!auth) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
