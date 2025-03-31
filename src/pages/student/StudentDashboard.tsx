
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

// Sample data for demonstration
const sampleUserData = {
  name: 'Muhammad Ali',
  email: 'muhammad.ali@example.com',
  documentsUploaded: 7,
  documentsRequired: 12,
  applications: [
    { id: 1, university: 'University of London', program: 'MS Computer Science', status: 'pending', progress: 60 },
    { id: 2, university: 'Imperial College London', program: 'MS Data Science', status: 'submitted', progress: 80 },
  ],
  notifications: [
    { id: 1, message: 'Your passport copy needs to be updated', read: false, date: '2023-10-15' },
    { id: 2, message: 'Application to University of London has been submitted', read: true, date: '2023-10-12' },
    { id: 3, message: 'Your IELTS score has been verified', read: true, date: '2023-10-10' },
  ]
};

const StudentDashboard = () => {
  const [userData, setUserData] = useState(sampleUserData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        // Replace with actual API call when backend is ready
        // const response = await fetch('/api/student/dashboard');
        // const data = await response.json();
        // setUserData(data);
        
        // For demo, use sample data with a delay to simulate loading
        setTimeout(() => {
          setUserData(sampleUserData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        ) : (
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
                  {userData.applications.map((app) => (
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
                  ))}

                  {userData.applications.length === 0 && (
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
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
