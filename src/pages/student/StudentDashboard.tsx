
import { useEffect, useState } from 'react';
import { 
  BookOpen, FileText, BarChart3, Clock, CheckCircle2, AlertCircle,
  FileUp, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import StudentLayout from '@/components/student/StudentLayout';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  name: string;
  email: string;
  documentsUploaded: number;
  documentsRequired: number;
  applications: {
    id: number;
    university: string;
    program: string;
    status: string;
    progress: number;
  }[];
  notifications: {
    id: number;
    message: string;
    read: boolean;
    date: string;
  }[];
}

const StudentDashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user info from localStorage
        const userString = localStorage.getItem('studentUser');
        if (!userString) {
          throw new Error('User data not found');
        }
        
        const user = JSON.parse(userString);
        
        // For now, we'll create a simple dashboard with the user's info
        // In a production app, you would fetch more data from your API
        const dashboardData: UserData = {
          name: user.name || 'Student',
          email: user.email || '',
          documentsUploaded: 0,
          documentsRequired: 5,
          applications: [],
          notifications: [
            { 
              id: 1, 
              message: 'Welcome to your student portal. Please complete your profile and upload required documents.',
              read: false,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
        
        // Try to fetch more student data if API is available
        try {
          const token = localStorage.getItem('studentToken');
          if (token) {
            const response = await fetch('http://localhost:8000/students/dashboard', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const apiData = await response.json();
              // Merge API data with basic user data
              dashboardData.documentsUploaded = apiData.documents_uploaded || 0;
              dashboardData.documentsRequired = apiData.documents_required || 5;
              if (apiData.applications) {
                dashboardData.applications = apiData.applications;
              }
              if (apiData.notifications) {
                dashboardData.notifications = apiData.notifications;
              }
            }
          }
        } catch (apiError) {
          console.warn('Could not fetch additional dashboard data:', apiError);
          // Continue with basic user data
        }
        
        setUserData(dashboardData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast({
          title: 'Error loading dashboard',
          description: 'Please try logging in again',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  return (
    <StudentLayout title="Dashboard">
      <div className="animate-fade-in">
        {isLoading ? (
          // Skeleton loader
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-48 bg-muted rounded-lg animate-pulse"></div>
          </div>
        ) : userData ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Welcome back, {userData.name}!</h2>
              <p className="text-muted-foreground">
                Track your application progress and manage your documents.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {userData.documentsUploaded}/{userData.documentsRequired}
                  </div>
                  <Progress 
                    value={(userData.documentsUploaded / userData.documentsRequired) * 100} 
                    className="mt-2"
                  />
                </CardContent>
                <CardFooter>
                  <Link to="/student/documents" className="text-primary text-sm hover:underline flex items-center">
                    Manage documents <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userData.applications.length}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Active applications
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/student/applications" className="text-primary text-sm hover:underline flex items-center">
                    View applications <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    AI-powered suggestions
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/student/recommendations" className="text-primary text-sm hover:underline flex items-center">
                    View recommendations <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Applications progress */}
            <Card className="mb-8 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Application Progress
                </CardTitle>
                <CardDescription>
                  Track the status of your university applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.applications.length > 0 ? (
                    userData.applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-semibold">{app.university}</h3>
                            <p className="text-sm text-muted-foreground">{app.program}</p>
                          </div>
                          <div className="flex items-center">
                            {app.status === 'pending' ? (
                              <Clock className="h-5 w-5 text-amber-500 mr-2" />
                            ) : app.status === 'submitted' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className="capitalize">{app.status}</span>
                          </div>
                        </div>
                        <Progress value={app.progress} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No applications yet.</p>
                      <Button variant="outline" className="mt-2">
                        Apply to a university
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/student/applications">
                  <Button variant="outline" size="sm">View all applications</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Upload document reminder */}
            <Card className="mb-8 bg-primary/5 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileUp className="mr-2 h-5 w-5 text-primary" />
                  Required Documents
                </CardTitle>
                <CardDescription>
                  Complete your profile by uploading these documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-md bg-background">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span>Passport Copy</span>
                    </div>
                    <Link to="/student/documents">
                      <Button size="sm">Upload</Button>
                    </Link>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-background">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span>Academic Transcripts</span>
                    </div>
                    <Link to="/student/documents">
                      <Button size="sm">Upload</Button>
                    </Link>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-background">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <span>IELTS Certificate</span>
                    </div>
                    <Link to="/student/documents">
                      <Button size="sm">Upload</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Login session expired</h2>
            <p className="text-muted-foreground mt-2">Please log in again to view your dashboard</p>
            <Link to="/student/login">
              <Button className="mt-4">Go to login</Button>
            </Link>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
