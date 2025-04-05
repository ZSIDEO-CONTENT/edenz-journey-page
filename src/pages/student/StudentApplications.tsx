
import { useState, useEffect } from 'react';
import {
  BookOpen, Clock, CheckCircle2, AlertCircle, Eye, 
  BarChart3, School, Calendar, GraduationCap, Loader2
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentLayout from '@/components/student/StudentLayout';
import { getStudentApplications } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        // Get user info from localStorage
        const userString = localStorage.getItem('studentUser');
        
        if (!userString) {
          toast({
            title: 'Session expired',
            description: 'Please log in again',
            variant: 'destructive',
          });
          return;
        }
        
        const user = JSON.parse(userString);
        const response = await getStudentApplications(user.id);
        setApplications(response || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load application data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'offer_received':
        return <Badge className="bg-green-500">Offer Received</Badge>;
      case 'in_progress':
      case 'in_review':
        return <Badge className="bg-blue-500">In Review</Badge>;
      case 'submitted':
      case 'pending':
      case 'new':
        return <Badge className="bg-yellow-500">Submitted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
      case 'new':
        return <Clock className="h-5 w-5 text-gray-300" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <StudentLayout title="My Applications">
      <div className="animate-fade-in">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <p>Loading applications...</p>
              </div>
            ) : applications.length > 0 ? (
              applications.map((app: any) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <School className="mr-2 h-5 w-5 text-primary" />
                          {app.university_name}
                        </CardTitle>
                        <CardDescription>{app.program_name}</CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          {app.country || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Submitted: {app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Progress: {app.progress || 0}%</span>
                      </div>
                    </div>
                    
                    <Progress value={app.progress || 0} className="h-2 mb-4" />
                    
                    {selectedApplication === app.id && app.steps && (
                      <div className="mt-4 space-y-4 border-t pt-4 animate-fade-in">
                        <h4 className="font-medium">Application Timeline</h4>
                        <div className="space-y-3">
                          {app.steps.map((step: any, index: number) => (
                            <div key={index} className="flex items-start">
                              {getStatusIcon(step.status)}
                              <div className="ml-3">
                                <div className="font-medium">{step.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {step.status === 'completed' && step.date
                                    ? `Completed on ${step.date}`
                                    : step.status === 'in_progress'
                                    ? 'In progress'
                                    : 'Pending'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedApplication(selectedApplication === app.id ? null : app.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedApplication === app.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No applications yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your processing officer will create applications for you once you complete your profile and upload required documents.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in_progress">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Loading applications...</p>
                </div>
              ) : applications.filter((app: any) => app.status === 'in_review' || app.status === 'in_progress' || app.status === 'submitted' || app.status === 'new' || app.status === 'pending').length > 0 ? (
                applications.filter((app: any) => app.status === 'in_review' || app.status === 'in_progress' || app.status === 'submitted' || app.status === 'new' || app.status === 'pending').map((app: any) => (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <School className="mr-2 h-5 w-5 text-primary" />
                            {app.university_name}
                          </CardTitle>
                          <CardDescription>{app.program_name}</CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">
                            {app.country || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">
                            Submitted: {app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">Progress: {app.progress || 0}%</span>
                        </div>
                      </div>
                      
                      <Progress value={app.progress || 0} className="h-2 mb-4" />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedApplication(selectedApplication === app.id ? null : app.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No applications in progress</h3>
                  <p className="text-muted-foreground">You don't have any applications currently in progress.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Loading applications...</p>
                </div>
              ) : applications.filter((app: any) => app.status === 'offer_received' || app.status === 'rejected' || app.status === 'completed').length > 0 ? (
                applications.filter((app: any) => app.status === 'offer_received' || app.status === 'rejected' || app.status === 'completed').map((app: any) => (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <School className="mr-2 h-5 w-5 text-primary" />
                            {app.university_name}
                          </CardTitle>
                          <CardDescription>{app.program_name}</CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">
                            {app.country || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">
                            Submitted: {app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">Progress: {app.progress || 0}%</span>
                        </div>
                      </div>
                      
                      <Progress value={app.progress || 0} className="h-2 mb-4" />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedApplication(selectedApplication === app.id ? null : app.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No completed applications</h3>
                  <p className="text-muted-foreground">You don't have any completed applications yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentApplications;
