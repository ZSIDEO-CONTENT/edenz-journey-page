
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, isStudentAuthenticated, isProcessingAuthenticated, isB2BAuthenticated } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAdmin?: boolean;
  requiresStudent?: boolean;
  requiresProcessing?: boolean;
  requiresB2B?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiresAdmin = false, 
  requiresStudent = false,
  requiresProcessing = false,
  requiresB2B = false 
}: ProtectedRouteProps) => {
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
        } else if (requiresProcessing) {
          isAuth = await isProcessingAuthenticated();
          if (!isAuth) {
            toast({
              title: "Authentication required",
              description: "Please log in to access the processing team portal",
              variant: "destructive",
            });
            navigate("/processing/login");
          }
        } else if (requiresB2B) {
          isAuth = await isB2BAuthenticated();
          if (!isAuth) {
            toast({
              title: "Authentication required",
              description: "Please log in to access the B2B portal",
              variant: "destructive",
            });
            navigate("/b2b/login");
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
  }, [navigate, requiresAdmin, requiresStudent, requiresProcessing, requiresB2B]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Verifying your credentials...</p>
      </div>
    );
  }

  if (!auth) {
    if (requiresAdmin) {
      return <Navigate to="/admin/login" />;
    } else if (requiresStudent) {
      return <Navigate to="/student/login" />;
    } else if (requiresProcessing) {
      return <Navigate to="/processing/login" />;
    } else if (requiresB2B) {
      return <Navigate to="/b2b/login" />;
    }
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
