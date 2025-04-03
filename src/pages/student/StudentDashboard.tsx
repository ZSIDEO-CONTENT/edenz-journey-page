
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, BookOpen, Clock, CheckCircle2, AlertCircle,
  FileUp, ArrowRight, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import StudentLayout from '@/components/student/StudentLayout';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  missing?: any[];
  link: string;
}

const StudentDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user info from localStorage
        const userString = localStorage.getItem('studentUser');
        const tokenString = localStorage.getItem('studentToken');
        
        if (!userString || !tokenString) {
          throw new Error('User data not found');
        }
        
        const user = JSON.parse(userString);
        setUserData(user);
        
        // Try to fetch onboarding steps and applications
        try {
          const token = localStorage.getItem('studentToken');
          
          if (token && user.id) {
            // Fetch onboarding steps
            const onboardingResponse = await fetch(`http://localhost:8000/api/student/onboarding-steps/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (onboardingResponse.ok) {
              const onboardingData = await onboardingResponse.json();
              setOnboardingSteps(onboardingData.steps || []);
              setOnboardingProgress(onboardingData.progress || 0);
            }
            
            // Fetch applications
            const applicationsResponse = await fetch(`http://localhost:8000/api/student/applications/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (applicationsResponse.ok) {
              const applicationsData = await applicationsResponse.json();
              setApplications(applicationsData || []);
            }
          }
        } catch (apiError) {
          console.warn('Could not fetch additional dashboard data:', apiError);
          // Continue with basic user data
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast({
          title: 'Error loading dashboard',
          description: 'Please try logging in again',
          variant: 'destructive',
        });
        navigate('/student/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast, navigate]);

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

            {/* Onboarding Progress */}
            {onboardingSteps && onboardingSteps.length > 0 && (
              <Card className="mb-8 bg-primary/5 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Complete these steps to set up your student profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Overall Progress</p>
                    <p className="text-sm font-medium">{onboardingProgress}%</p>
                  </div>
                  <Progress value={onboardingProgress} className="h-2" />
                  
                  <div className="space-y-3 mt-4">
                    {onboardingSteps.map((step) => (
                      <div key={step.id} className="flex justify-between items-center p-2 rounded-md bg-background">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${step.completed ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                          <span>{step.title}</span>
                        </div>
                        <Link to={step.link}>
                          <Button size="sm" variant={step.completed ? "outline" : "default"}>
                            {step.completed ? 'View' : 'Complete'}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
                    {userData.documentsUploaded || 0}/{userData.documentsRequired || 5}
                  </div>
                  <Progress 
                    value={(userData.documentsUploaded || 0) / (userData.documentsRequired || 5) * 100} 
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
                  <div className="text-3xl font-bold">{applications ? applications.length : 0}</div>
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
                  <div className="text-3xl font-bold">0</div>
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
                  {applications && applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-semibold">{app.university_name}</h3>
                            <p className="text-sm text-muted-foreground">{app.program_name}</p>
                          </div>
                          <div className="flex items-center">
                            {app.status === 'pending' || app.status === 'new' ? (
                              <Clock className="h-5 w-5 text-amber-500 mr-2" />
                            ) : app.status === 'submitted' || app.status === 'application_submitted' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className="capitalize">{app.status.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                        <Progress value={app.progress} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No applications yet.</p>
                      <p className="text-sm mt-2">Your processing officer will create applications for you.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              {applications && applications.length > 0 && (
                <CardFooter>
                  <Link to="/student/applications">
                    <Button variant="outline" size="sm">View all applications</Button>
                  </Link>
                </CardFooter>
              )}
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
