
// Import the necessary functions and components
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentDetails, getStudentDocuments, createStudentApplication } from "@/lib/api";
import ProcessingLayout from "@/components/processing/ProcessingLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, FileText, School, CheckCircle2, BookOpen, GraduationCap } from "lucide-react";

const ProcessingStudent = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const studentData = await getStudentDetails(id);
        setStudent(studentData);
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast({
          title: "Error",
          description: "Failed to load student details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }

      try {
        setLoadingDocuments(true);
        const documentData = await getStudentDocuments(id);
        setDocuments(documentData || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to load student documents.",
          variant: "destructive",
        });
      } finally {
        setLoadingDocuments(false);
      }
    };
    
    fetchData();
  }, [id]);

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleCreateApplication = async () => {
    if (!id) return;

    try {
      setIsCreatingApplication(true);
      
      // Mock application data - in a real app, this would come from a form
      const applicationData = {
        university: "Sample University",
        program: "Bachelor of Science",
        term: "Fall 2023",
      };
      
      // Fixed function call with both parameters
      await createStudentApplication(id, applicationData);
      
      toast({
        title: "Success",
        description: "Application created successfully",
      });
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Error",
        description: "Failed to create application.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingApplication(false);
    }
  };

  if (isLoading) {
    return (
      <ProcessingLayout title="Student Profile">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading student profile...</span>
        </div>
      </ProcessingLayout>
    );
  }

  if (!student) {
    return (
      <ProcessingLayout title="Student Not Found">
        <div className="text-center p-8">
          <p className="mb-4">The requested student profile could not be found.</p>
          <Button asChild>
            <Link to="/processing/students">Back to Students</Link>
          </Button>
        </div>
      </ProcessingLayout>
    );
  }

  return (
    <ProcessingLayout title={`Student: ${student.name}`}>
      <div className="grid gap-6">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1">{student.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1">{student.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1">{student.phone || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1">{student.dob || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1">{student.address || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Preferred Country</dt>
                    <dd className="mt-1">{student.preferred_country || "Not specified"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Submitted Documents
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loadingDocuments ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading documents...</span>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{doc.name}</h3>
                          {getDocumentStatusBadge(doc.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Type: {doc.type.replace(/_/g, ' ').toUpperCase()}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                              View Document
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents uploaded yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="h-5 w-5 mr-2 text-primary" />
                  Education History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.education && student.education.length > 0 ? (
                  <div className="space-y-6">
                    {student.education.map((edu: any, index: number) => (
                      <div key={index} className="border rounded-md p-4">
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{edu.institution}, {edu.country}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Major:</span>
                            <span className="ml-2">{edu.major || "Not specified"}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">GPA:</span>
                            <span className="ml-2">{edu.gpa}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Start Date:</span>
                            <span className="ml-2">{edu.start_date || "Not specified"}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">End Date:</span>
                            <span className="ml-2">{edu.end_date || edu.year_completed || "Not specified"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No education history provided.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Applications
                  </CardTitle>
                  <Button 
                    size="sm" 
                    onClick={handleCreateApplication}
                    disabled={isCreatingApplication}
                  >
                    {isCreatingApplication ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Create Application
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>
                  View and manage student's university applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {student.applications && student.applications.length > 0 ? (
                  <div className="space-y-4">
                    {student.applications.map((app: any) => (
                      <div key={app.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{app.university}</h3>
                          <Badge 
                            className={app.status === "accepted" ? "bg-green-500" : 
                              app.status === "rejected" ? "bg-red-500" : "bg-yellow-500"}
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Program: {app.program} | Term: {app.term}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create a new application for this student using the button above.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProcessingLayout>
  );
};

export default ProcessingStudent;
