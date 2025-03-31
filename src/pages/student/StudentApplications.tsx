
import { useState } from 'react';
import {
  BookOpen, Clock, CheckCircle2, AlertCircle, Eye, Plus, 
  BarChart3, School, Calendar, GraduationCap
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

// Sample application data
const sampleApplications = [
  {
    id: 1,
    university: 'University of London',
    program: 'MS Computer Science',
    country: 'United Kingdom',
    submissionDate: '2023-10-05',
    status: 'in_review',
    progress: 60,
    steps: [
      { name: 'Initial documentation', status: 'completed', date: '2023-09-28' },
      { name: 'Application submission', status: 'completed', date: '2023-10-05' },
      { name: 'University processing', status: 'in_progress', date: null },
      { name: 'Interview scheduling', status: 'pending', date: null },
      { name: 'Final decision', status: 'pending', date: null }
    ]
  },
  {
    id: 2,
    university: 'Imperial College London',
    program: 'MS Data Science',
    country: 'United Kingdom',
    submissionDate: '2023-10-01',
    status: 'submitted',
    progress: 80,
    steps: [
      { name: 'Initial documentation', status: 'completed', date: '2023-09-15' },
      { name: 'Application submission', status: 'completed', date: '2023-10-01' },
      { name: 'University processing', status: 'completed', date: '2023-10-10' },
      { name: 'Interview scheduling', status: 'in_progress', date: null },
      { name: 'Final decision', status: 'pending', date: null }
    ]
  },
  {
    id: 3,
    university: 'Technical University of Munich',
    program: 'MS Robotics',
    country: 'Germany',
    submissionDate: '2023-09-20',
    status: 'offer_received',
    progress: 100,
    steps: [
      { name: 'Initial documentation', status: 'completed', date: '2023-08-28' },
      { name: 'Application submission', status: 'completed', date: '2023-09-20' },
      { name: 'University processing', status: 'completed', date: '2023-09-30' },
      { name: 'Interview scheduling', status: 'completed', date: '2023-10-05' },
      { name: 'Final decision', status: 'completed', date: '2023-10-12' }
    ]
  }
];

const StudentApplications = () => {
  const [applications, setApplications] = useState(sampleApplications);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'offer_received':
        return <Badge className="bg-green-500">Offer Received</Badge>;
      case 'in_review':
        return <Badge className="bg-blue-500">In Review</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-500">Submitted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>

          <TabsContent value="all" className="space-y-6">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <School className="mr-2 h-5 w-5 text-primary" />
                        {app.university}
                      </CardTitle>
                      <CardDescription>{app.program}</CardDescription>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">{app.country}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Submitted: {app.submissionDate}</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Progress: {app.progress}%</span>
                    </div>
                  </div>
                  
                  <Progress value={app.progress} className="h-2 mb-4" />
                  
                  {selectedApplication === app.id && (
                    <div className="mt-4 space-y-4 border-t pt-4 animate-fade-in">
                      <h4 className="font-medium">Application Timeline</h4>
                      <div className="space-y-3">
                        {app.steps.map((step, index) => (
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
            ))}

            {applications.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No applications yet</h3>
                <p className="text-muted-foreground mb-4">Start your educational journey by applying to universities.</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in_progress">
            <div className="space-y-6">
              {applications.filter(app => app.status === 'in_review' || app.status === 'submitted').map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  {/* Same card content as "all" tab */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <School className="mr-2 h-5 w-5 text-primary" />
                          {app.university}
                        </CardTitle>
                        <CardDescription>{app.program}</CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">{app.country}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Submitted: {app.submissionDate}</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Progress: {app.progress}%</span>
                      </div>
                    </div>
                    
                    <Progress value={app.progress} className="h-2 mb-4" />
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-6">
              {applications.filter(app => app.status === 'offer_received' || app.status === 'rejected').map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  {/* Same card content as "all" tab */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <School className="mr-2 h-5 w-5 text-primary" />
                          {app.university}
                        </CardTitle>
                        <CardDescription>{app.program}</CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">{app.country}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Submitted: {app.submissionDate}</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Progress: {app.progress}%</span>
                      </div>
                    </div>
                    
                    <Progress value={app.progress} className="h-2 mb-4" />
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentApplications;
