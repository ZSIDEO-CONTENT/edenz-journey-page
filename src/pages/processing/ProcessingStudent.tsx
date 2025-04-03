
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, FileText, Download, BookOpen, Plus, 
  Clock, CheckCircle2, AlertCircle, BarChart3, Loader2, CalendarDays,
  School, Briefcase
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProcessingLayout from '@/components/processing/ProcessingLayout';
import { useToast } from '@/hooks/use-toast';
import { getStudentDetails, getStudentDocuments, createStudentApplication, generateStudentRecommendation } from '@/lib/api';

// Define form schema for creating an application
const applicationSchema = z.object({
  university_name: z.string().min(1, 'University name is required'),
  program_name: z.string().min(1, 'Program name is required'),
  intake: z.string().min(1, 'Intake is required'),
  status: z.string().default('new'),
  application_fee: z.string().optional(),
  tuition_fee: z.string().optional(),
  estimated_living_cost: z.string().optional(),
  notes: z.string().optional()
});

const ProcessingStudent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);

  // Initialize form for creating applications
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      university_name: '',
      program_name: '',
      intake: '',
      status: 'new',
      application_fee: '',
      tuition_fee: '',
      estimated_living_cost: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (!id) return;
    
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        
        // Get student details
        const data = await getStudentDetails(id);
        
        if (data) {
          setStudentData(data.profile);
          setEducation(data.education || []);
          setDocuments(data.documents || []);
          setApplications(data.applications || []);
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load student data',
          variant: 'destructive',
        });
        navigate('/processing/students');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [id, navigate, toast]);

  const handleCreateApplication = async (values: z.infer<typeof applicationSchema>) => {
    if (!id) return;
    
    try {
      setIsCreatingApplication(true);
      
      const numericValues = {
        ...values,
        application_fee: values.application_fee ? parseFloat(values.application_fee) : undefined,
        tuition_fee: values.tuition_fee ? parseFloat(values.tuition_fee) : undefined,
        estimated_living_cost: values.estimated_living_cost ? parseFloat(values.estimated_living_cost) : undefined
      };
      
      const result = await createStudentApplication({
        student_id: id,
        ...numericValues
      });
      
      toast({
        title: 'Application created',
        description: 'The application has been created successfully',
      });
      
      // Refresh the student data to include new application
      const updatedData = await getStudentDetails(id);
      setApplications(updatedData.applications || []);
      
      // Close dialog and reset form
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to create application',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingApplication(false);
    }
  };

  const handleGenerateRecommendation = async () => {
    if (!id) return;
    
    try {
      setIsGeneratingRecommendation(true);
      
      await generateStudentRecommendation(id);
      
      toast({
        title: 'Recommendation generated',
        description: 'AI recommendation has been generated successfully',
      });
      
      // Navigate to recommendations page
      navigate(`/processing/recommendations/${id}`);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate recommendation',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  return (
    <ProcessingLayout title="Student Profile">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading student profile...</p>
        </div>
      ) : studentData ? (
        <div className="space-y-6">
          {/* Student Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto">
                    {studentData.profile_picture ? (
                      <AvatarImage src={studentData.profile_picture} alt={studentData.name} />
                    ) : (
                      <AvatarFallback>{studentData.name?.charAt(0) || 'S'}</AvatarFallback>
                    )}
                  </Avatar>
                  <CardTitle className="mt-4">{studentData.name}</CardTitle>
                  <CardDescription>Student</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{studentData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{studentData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{studentData.address || 'No address provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{studentData.dob || 'No DOB provided'}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-3">
                  <Button 
                    onClick={handleGenerateRecommendation}
                    disabled={isGeneratingRecommendation}
                  >
                    {isGeneratingRecommendation ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Recommendation
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="w-full md:w-2/3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                  <CardDescription>Personal and academic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preferred Country</p>
                      <p className="text-base">{studentData.preferred_country || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Education Level</p>
                      <p className="text-base">{studentData.education_level || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Funding Source</p>
                      <p className="text-base">{studentData.funding_source || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Budget</p>
                      <p className="text-base">{studentData.budget || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Bio</p>
                    <p className="text-base">{studentData.bio || 'No bio provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Number of Applications</p>
                    <p className="text-base">{applications.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Number of Documents</p>
                    <p className="text-base">{documents.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Tabs for different sections */}
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            
            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Applications</h2>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Create New Application</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new student application
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleCreateApplication)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="university_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="program_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Program Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="intake"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Intake</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g. September 2024" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="application_fee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Application Fee</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0.00" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="tuition_fee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tuition Fee</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0.00" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="estimated_living_cost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Living Cost</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0.00" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="documents_requested">Documents Requested</SelectItem>
                                  <SelectItem value="documents_submitted">Documents Submitted</SelectItem>
                                  <SelectItem value="application_submitted">Application Submitted</SelectItem>
                                  <SelectItem value="under_review">Under Review</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Additional details about this application" 
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={isCreatingApplication}
                          >
                            {isCreatingApplication ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Creating...
                              </>
                            ) : 'Create Application'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{app.university_name}</h3>
                              <p className="text-sm text-muted-foreground">{app.program_name}</p>
                              <p className="text-sm">Intake: {app.intake}</p>
                            </div>
                            <div className="flex items-center">
                              {app.status === 'new' ? (
                                <Clock className="h-5 w-5 text-amber-500 mr-2" />
                              ) : app.status === 'application_submitted' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                              )}
                              <span className="capitalize">{app.status.replace(/_/g, ' ')}</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Progress</span>
                              <span className="text-sm font-semibold">{app.progress}%</span>
                            </div>
                            <Progress value={app.progress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Application Fee</p>
                              <p className="text-sm font-semibold">${app.application_fee || '0'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Tuition Fee</p>
                              <p className="text-sm font-semibold">${app.tuition_fee || '0'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Living Cost (est.)</p>
                              <p className="text-sm font-semibold">${app.estimated_living_cost || '0'}</p>
                            </div>
                          </div>
                          
                          {app.notes && (
                            <div>
                              <p className="text-sm text-muted-foreground">Notes:</p>
                              <p className="text-sm">{app.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline">View Details</Button>
                            <Button size="sm">Update Status</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center p-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">This student hasn't started any applications</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Application
                  </Button>
                </Card>
              )}
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <h2 className="text-xl font-semibold">Documents</h2>
              
              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{doc.name}</CardTitle>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <CardDescription>{doc.type}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">
                          Uploaded on: {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                        {doc.feedback && (
                          <p className="text-sm border-l-2 border-primary pl-2 italic">
                            {doc.feedback}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center p-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Documents Uploaded</h3>
                  <p className="text-muted-foreground">This student hasn't uploaded any documents yet</p>
                </Card>
              )}
            </TabsContent>
            
            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4">
              <h2 className="text-xl font-semibold">Education History</h2>
              
              {education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu) => (
                    <Card key={edu.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{edu.degree}</CardTitle>
                            <CardDescription>{edu.institution}</CardDescription>
                          </div>
                          <div className="bg-primary/10 px-2 py-1 rounded text-sm">
                            {edu.country || 'Unknown'}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center">
                          <School className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>Major: {edu.major || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>
                            {edu.start_date ? `${edu.start_date} - ${edu.end_date || 'Present'}` : `Completed: ${edu.year_completed}`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>GPA: {edu.gpa || 'Not provided'}</span>
                        </div>
                      </CardContent>
                      {edu.documents && edu.documents.length > 0 && (
                        <CardFooter className="border-t pt-4">
                          <div className="w-full">
                            <p className="text-sm font-medium mb-2">Documents:</p>
                            <div className="flex gap-2">
                              {edu.documents.map((docId: string, index: number) => (
                                <Button key={index} variant="outline" size="sm" asChild>
                                  <Link to={`/processing/document/${docId}`}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Document {index + 1}
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center p-12">
                  <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Education History</h3>
                  <p className="text-muted-foreground">This student hasn't added any education details yet</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Student not found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the student you're looking for</p>
          <Button asChild>
            <Link to="/processing/students">Back to Students List</Link>
          </Button>
        </div>
      )}
    </ProcessingLayout>
  );
};

export default ProcessingStudent;
