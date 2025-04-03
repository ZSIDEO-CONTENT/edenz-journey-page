
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FileText, Home, User, BookOpen, LogOut, 
  Users, BarChart3, Menu, X, MessagesSquare,
  FileUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutProcessing } from "@/lib/api";

interface ProcessingLayoutProps {
  children: React.ReactNode;
  title: string;
}

const ProcessingLayout = ({ children, title }: ProcessingLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from storage
    logoutProcessing();
    
    // Redirect to login page
    navigate("/processing/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/processing/dashboard", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: "Students", 
      path: "/processing/students", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: "Applications", 
      path: "/processing/applications", 
      icon: <BookOpen className="h-5 w-5" /> 
    },
    { 
      name: "Chat with Edenz AI", 
      path: "/chat", 
      icon: <MessagesSquare className="h-5 w-5" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile sidebar toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background shadow-lg transform transition-transform duration-300 md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <FileUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Processing Team</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start text-foreground/80 hover:text-foreground hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300",
        "md:ml-64 min-h-screen"
      )}>
        <header className="bg-background shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4 md:px-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </header>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ProcessingLayout;
