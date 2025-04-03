
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, Bell, 
  Clock, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProcessingLayout from '@/components/processing/ProcessingLayout';
import { useToast } from '@/hooks/use-toast';
import { getAllStudents } from '@/lib/api';

interface ProcessingUser {
  name: string;
  email: string;
  managed_regions?: string[];
}

const ProcessingDashboard = () => {
  const [userData, setUserData] = useState<ProcessingUser | null>(null);
  const [students, setStudents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get user info from localStorage
        const userString = localStorage.getItem('processingUser');
        if (!userString) {
          toast({
            title: 'Session expired',
            description: 'Please log in again',
            variant: 'destructive',
          });
          navigate('/processing/login');
          return;
        }
        
        const user = JSON.parse(userString);
        setUserData(user);
        
        // Fetch students data
        const studentsData = await getAllStudents();
        setStudents(studentsData.slice(0, 5)); // Show only 5 recent students

        // Mock recent activity data
        const mockActivity = [
          { id: 1, type: 'application', message: 'New application created for John Smith', time: '10 minutes ago', status: 'new' },
          { id: 2, type: 'document', message: 'Mary Johnson uploaded passport document', time: '1 hour ago', status: 'pending' },
          { id: 3, type: 'application', message: 'Visa approved for Alex Williams', time: '3 hours ago', status: 'approved' },
          { id: 4, type: 'document', message: 'Financial statement rejected - insufficient funds', time: '5 hours ago', status: 'rejected' },
          { id: 5, type: 'application', message: 'University confirmation received for Sarah Lee', time: 'Yesterday', status: 'updated' }
        ];
        setRecentActivity(mockActivity);
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

    fetchData();
  }, [navigate, toast]);

  return (
    <ProcessingLayout title="Processing Dashboard">
      <div className="animate-fade-in">
        {isLoading ? (
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
              <h2 className="text-2xl font-semibold mb-2">Welcome, {userData.name}!</h2>
              <p className="text-muted-foreground">
                Manage student applications and review their documentation
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{students.length}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Active students
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/processing/students" className="text-primary text-sm hover:underline flex items-center">
                    View all students <ArrowRight className="ml-1 h-4 w-4" />
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
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Active applications
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/processing/applications" className="text-primary text-sm hover:underline flex items-center">
                    View all applications <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-primary" />
                    Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pending tasks
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">View tasks</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Recent activity */}
            <Card className="mb-8 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and activity in your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-md hover:bg-muted/50">
                      <div className="mt-0.5">
                        {activity.status === 'new' || activity.status === 'updated' ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : activity.status === 'approved' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : activity.status === 'rejected' ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Bell className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">View all activity</Button>
              </CardFooter>
            </Card>

            {/* Recent students */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>
                  Recently registered students or with recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student: any) => (
                    <div key={student.id} className="flex justify-between items-center p-3 rounded-md hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <Link to={`/processing/student/${student.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/processing/students">
                  <Button variant="outline" size="sm">View all students</Button>
                </Link>
              </CardFooter>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Login session expired</h2>
            <p className="text-muted-foreground mt-2">Please log in again to view your dashboard</p>
            <Link to="/processing/login">
              <Button className="mt-4">Go to login</Button>
            </Link>
          </div>
        )}
      </div>
    </ProcessingLayout>
  );
};

export default ProcessingDashboard;
