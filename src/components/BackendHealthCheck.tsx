
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkBackendHealth, testAuthenticatedEndpoint } from '@/lib/healthCheck';

const BackendHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [authTests, setAuthTests] = useState<Record<string, any>>({});

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkBackendHealth();
      setHealthStatus(result);
      
      // Test authentication for existing tokens
      const adminToken = localStorage.getItem('adminToken');
      const studentToken = localStorage.getItem('studentToken');
      const processingToken = localStorage.getItem('processingToken');
      
      const tests: Record<string, any> = {};
      
      if (adminToken) {
        tests.admin = await testAuthenticatedEndpoint(adminToken, 'Admin');
      }
      
      if (studentToken) {
        tests.student = await testAuthenticatedEndpoint(studentToken, 'Student');
      }
      
      if (processingToken) {
        tests.processing = await testAuthenticatedEndpoint(processingToken, 'Processing');
      }
      
      setAuthTests(tests);
      
    } catch (error) {
      setHealthStatus({
        status: 'error',
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'connected' || status === 'success' ? 'default' : 'destructive';
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Backend Health Check
          <Button 
            onClick={runHealthCheck} 
            disabled={isChecking}
            size="sm"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Refresh'
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Check the status of backend connections and authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthStatus && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h3 className="font-medium">Backend Connection</h3>
              <p className="text-sm text-muted-foreground">{healthStatus.message}</p>
            </div>
            {getStatusBadge(healthStatus.status)}
          </div>
        )}
        
        {Object.entries(authTests).map(([role, test]) => (
          <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h3 className="font-medium">{role.charAt(0).toUpperCase() + role.slice(1)} Authentication</h3>
              <p className="text-sm text-muted-foreground">{test.message}</p>
            </div>
            {getStatusBadge(test.status)}
          </div>
        ))}
        
        {healthStatus?.status === 'disconnected' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Backend Setup Instructions</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Navigate to the django_backend directory</li>
              <li>Install dependencies: <code className="bg-yellow-100 px-1 rounded">pip install -r requirements.txt</code></li>
              <li>Run migrations: <code className="bg-yellow-100 px-1 rounded">python manage.py migrate</code></li>
              <li>Start the server: <code className="bg-yellow-100 px-1 rounded">python manage.py runserver 0.0.0.0:8000</code></li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendHealthCheck;
