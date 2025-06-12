
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  adminLogin, 
  studentLogin, 
  processingLogin, 
  b2bLogin,
  isAuthenticated,
  isStudentAuthenticated,
  isProcessingAuthenticated,
  isB2BAuthenticated,
  logout,
  logoutStudent,
  logoutProcessing,
  logoutB2B
} from '@/lib/api';
import { Shield, User, Users, Building2, TestTube } from 'lucide-react';

const TestAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState({
    admin: false,
    student: false,
    processing: false,
    b2b: false
  });
  const navigate = useNavigate();

  const checkAllAuthStatus = async () => {
    const status = {
      admin: await isAuthenticated(),
      student: await isStudentAuthenticated(),
      processing: await isProcessingAuthenticated(),
      b2b: await isB2BAuthenticated()
    };
    setAuthStatus(status);
  };

  const testLogin = async (type: 'admin' | 'student' | 'processing' | 'b2b') => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let result;
      switch (type) {
        case 'admin':
          result = await adminLogin(email, password);
          break;
        case 'student':
          result = await studentLogin(email, password);
          break;
        case 'processing':
          result = await processingLogin(email, password);
          break;
        case 'b2b':
          result = await b2bLogin(email, password);
          break;
      }

      toast({
        title: "Success",
        description: `${type} login successful`,
      });

      await checkAllAuthStatus();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || `${type} login failed`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogout = async (type: 'admin' | 'student' | 'processing' | 'b2b') => {
    switch (type) {
      case 'admin':
        logout();
        break;
      case 'student':
        logoutStudent();
        break;
      case 'processing':
        logoutProcessing();
        break;
      case 'b2b':
        logoutB2B();
        break;
    }
    
    toast({
      title: "Success",
      description: `${type} logout successful`,
    });
    
    await checkAllAuthStatus();
  };

  const navigateToDashboard = (type: 'admin' | 'student' | 'processing' | 'b2b') => {
    const routes = {
      admin: '/admin/dashboard',
      student: '/student/dashboard',
      processing: '/processing/dashboard',
      b2b: '/b2b/dashboard'
    };
    navigate(routes[type]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <TestTube className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Authentication Test Portal</h1>
          <p className="text-gray-600 mt-2">Test all authentication flows</p>
        </div>

        {/* Current Auth Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Authentication Status</CardTitle>
            <CardDescription>Check which portals you're currently logged into</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={authStatus.admin ? "default" : "secondary"}>
                <Shield className="w-3 h-3 mr-1" />
                Admin: {authStatus.admin ? "Authenticated" : "Not Authenticated"}
              </Badge>
              <Badge variant={authStatus.student ? "default" : "secondary"}>
                <User className="w-3 h-3 mr-1" />
                Student: {authStatus.student ? "Authenticated" : "Not Authenticated"}
              </Badge>
              <Badge variant={authStatus.processing ? "default" : "secondary"}>
                <Users className="w-3 h-3 mr-1" />
                Processing: {authStatus.processing ? "Authenticated" : "Not Authenticated"}
              </Badge>
              <Badge variant={authStatus.b2b ? "default" : "secondary"}>
                <Building2 className="w-3 h-3 mr-1" />
                B2B: {authStatus.b2b ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
            <Button onClick={checkAllAuthStatus} variant="outline">
              Refresh Status
            </Button>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Credentials</CardTitle>
            <CardDescription>Enter credentials to test login functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
          </CardContent>
        </Card>

        {/* Login Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Admin Portal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => testLogin('admin')} 
                disabled={loading}
                className="w-full"
              >
                Test Admin Login
              </Button>
              <Button 
                onClick={() => testLogout('admin')} 
                variant="outline"
                className="w-full"
              >
                Logout Admin
              </Button>
              <Button 
                onClick={() => navigateToDashboard('admin')} 
                variant="secondary"
                className="w-full"
                disabled={!authStatus.admin}
              >
                Go to Admin Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Student Portal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => testLogin('student')} 
                disabled={loading}
                className="w-full"
              >
                Test Student Login
              </Button>
              <Button 
                onClick={() => testLogout('student')} 
                variant="outline"
                className="w-full"
              >
                Logout Student
              </Button>
              <Button 
                onClick={() => navigateToDashboard('student')} 
                variant="secondary"
                className="w-full"
                disabled={!authStatus.student}
              >
                Go to Student Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Processing Portal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Processing Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => testLogin('processing')} 
                disabled={loading}
                className="w-full"
              >
                Test Processing Login
              </Button>
              <Button 
                onClick={() => testLogout('processing')} 
                variant="outline"
                className="w-full"
              >
                Logout Processing
              </Button>
              <Button 
                onClick={() => navigateToDashboard('processing')} 
                variant="secondary"
                className="w-full"
                disabled={!authStatus.processing}
              >
                Go to Processing Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* B2B Portal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                B2B Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => testLogin('b2b')} 
                disabled={loading}
                className="w-full"
              >
                Test B2B Login
              </Button>
              <Button 
                onClick={() => testLogout('b2b')} 
                variant="outline"
                className="w-full"
              >
                Logout B2B
              </Button>
              <Button 
                onClick={() => navigateToDashboard('b2b')} 
                variant="secondary"
                className="w-full"
                disabled={!authStatus.b2b}
              >
                Go to B2B Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/login')}>
                Admin Login Page
              </Button>
              <Button variant="outline" onClick={() => navigate('/student/login')}>
                Student Login Page
              </Button>
              <Button variant="outline" onClick={() => navigate('/processing/login')}>
                Processing Login Page
              </Button>
              <Button variant="outline" onClick={() => navigate('/b2b/login')}>
                B2B Login Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAuth;
