
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, isStudentAuthenticated } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAdmin?: boolean;
  requiresStudent?: boolean;
}

const ProtectedRoute = ({ children, requiresAdmin = false, requiresStudent = false }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let isAuth = false;
        
        if (requiresAdmin) {
          isAuth = await isAuthenticated();
          if (!isAuth) {
            toast({
              title: "Authentication required",
              description: "Please log in to access the admin area",
              variant: "destructive",
            });
            navigate("/admin/login");
          }
        } else if (requiresStudent) {
          isAuth = await isStudentAuthenticated();
          if (!isAuth) {
            toast({
              title: "Authentication required",
              description: "Please log in to access the student portal",
              variant: "destructive",
            });
            navigate("/student/login");
          }
        }
        
        setAuth(isAuth);
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
  }, [navigate, requiresAdmin, requiresStudent]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Verifying your credentials...</p>
      </div>
    );
  }

  if (!auth) {
    return <Navigate to={requiresAdmin ? "/admin/login" : "/student/login"} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
