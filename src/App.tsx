
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Countries from "./pages/Countries";
import Contact from "./pages/Contact";
import BookConsultation from "./pages/BookConsultation";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./pages/Chat";

// Student Portal Routes
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentDocuments from "./pages/student/StudentDocuments";
import StudentProfile from "./pages/student/StudentProfile";
import StudentApplications from "./pages/student/StudentApplications";
import StudentRecommendations from "./pages/student/StudentRecommendations";

// Processing Team Portal Routes
import ProcessingLogin from "./pages/processing/ProcessingLogin";
import ProcessingDashboard from "./pages/processing/ProcessingDashboard";
import ProcessingStudents from "./pages/processing/ProcessingStudents";
import ProcessingStudent from "./pages/processing/ProcessingStudent";
import ProcessingApplications from "./pages/processing/ProcessingApplications";
import ProcessingRecommendations from "./pages/processing/ProcessingRecommendations";
import ProcessingRegister from "./pages/admin/ProcessingRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/chat" element={<Chat />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiresAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/register-processing" 
            element={
              <ProtectedRoute requiresAdmin>
                <ProcessingRegister />
              </ProtectedRoute>
            } 
          />
          
          {/* Student Portal Routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute requiresStudent>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/student/documents" 
            element={
              <ProtectedRoute requiresStudent>
                <StudentDocuments />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute requiresStudent>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/student/applications" 
            element={
              <ProtectedRoute requiresStudent>
                <StudentApplications />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/student/recommendations" 
            element={
              <ProtectedRoute requiresStudent>
                <StudentRecommendations />
              </ProtectedRoute>
            }
          />
          
          {/* Processing Team Portal Routes */}
          <Route path="/processing/login" element={<ProcessingLogin />} />
          <Route 
            path="/processing/dashboard" 
            element={
              <ProtectedRoute requiresProcessing>
                <ProcessingDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/processing/students" 
            element={
              <ProtectedRoute requiresProcessing>
                <ProcessingStudents />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/processing/student/:id" 
            element={
              <ProtectedRoute requiresProcessing>
                <ProcessingStudent />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/processing/applications" 
            element={
              <ProtectedRoute requiresProcessing>
                <ProcessingApplications />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/processing/recommendations/:studentId" 
            element={
              <ProtectedRoute requiresProcessing>
                <ProcessingRecommendations />
              </ProtectedRoute>
            }
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
