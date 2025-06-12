
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import BookConsultation from '@/pages/BookConsultation';
import Countries from '@/pages/Countries';
import Chat from '@/pages/Chat';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiesPolicy from '@/pages/CookiesPolicy';

// Student routes
import StudentLogin from '@/pages/student/StudentLogin';
import StudentRegister from '@/pages/student/StudentRegister';
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentProfile from '@/pages/student/StudentProfile';
import StudentApplications from '@/pages/student/StudentApplications';
import StudentDocuments from '@/pages/student/StudentDocuments';
import StudentRecommendations from '@/pages/student/StudentRecommendations';

// Admin routes
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminRegister from '@/pages/admin/AdminRegister';
import ProcessingRegister from '@/pages/admin/ProcessingRegister';

// Processing routes
import ProcessingLogin from '@/pages/processing/ProcessingLogin';
import ProcessingDashboard from '@/pages/processing/ProcessingDashboard';
import ProcessingStudents from '@/pages/processing/ProcessingStudents';
import ProcessingStudent from '@/pages/processing/ProcessingStudent';
import ProcessingApplications from '@/pages/processing/ProcessingApplications';
import ProcessingRecommendations from '@/pages/processing/ProcessingRecommendations';

// B2B routes
import B2BLogin from '@/pages/b2b/B2BLogin';
import B2BDashboard from '@/pages/b2b/B2BDashboard';

import ProtectedRoute from '@/components/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/chat" element={<Chat />} />
            
            {/* Policy pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />

            {/* Student routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute requiresStudent={true}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/profile" 
              element={
                <ProtectedRoute requiresStudent={true}>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/applications" 
              element={
                <ProtectedRoute requiresStudent={true}>
                  <StudentApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/documents" 
              element={
                <ProtectedRoute requiresStudent={true}>
                  <StudentDocuments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/recommendations" 
              element={
                <ProtectedRoute requiresStudent={true}>
                  <StudentRecommendations />
                </ProtectedRoute>
              } 
            />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route 
              path="/admin/processing/register" 
              element={
                <ProtectedRoute requiresAdmin={true}>
                  <ProcessingRegister />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiresAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Processing routes */}
            <Route path="/processing/login" element={<ProcessingLogin />} />
            <Route 
              path="/processing/dashboard" 
              element={
                <ProtectedRoute requiresProcessing={true}>
                  <ProcessingDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/processing/students" 
              element={
                <ProtectedRoute requiresProcessing={true}>
                  <ProcessingStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/processing/students/:id" 
              element={
                <ProtectedRoute requiresProcessing={true}>
                  <ProcessingStudent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/processing/applications" 
              element={
                <ProtectedRoute requiresProcessing={true}>
                  <ProcessingApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/processing/recommendations" 
              element={
                <ProtectedRoute requiresProcessing={true}>
                  <ProcessingRecommendations />
                </ProtectedRoute>
              } 
            />

            {/* B2B routes */}
            <Route path="/b2b/login" element={<B2BLogin />} />
            <Route 
              path="/b2b/dashboard" 
              element={
                <ProtectedRoute requiresB2B={true}>
                  <B2BDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
      <Sonner />
    </QueryClientProvider>
  );
}

export default App;
