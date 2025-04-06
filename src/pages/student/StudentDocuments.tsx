
import { useState, useEffect } from 'react';
import { 
  FileText, Upload, Download, Trash2, CheckCircle, XCircle, 
  Clock, AlertCircle, Loader2, FileUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import StudentLayout from '@/components/student/StudentLayout';
import { getStudentDocuments, getRequiredDocuments } from '@/lib/api';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  file_url: string;
  feedback?: string;
  updated_at?: string;
}

interface RequiredDocument {
  name: string;
  type: string;
  description: string;
  document_id?: string;
  status?: string;
  submitted?: boolean;
  feedback?: string;
}

const StudentDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        
        // Get user info from localStorage
        const userString = localStorage.getItem('studentUser');
        if (!userString) {
          throw new Error('User data not found');
        }
        
        const user = JSON.parse(userString);
        
        // Fetch all documents for the student
        const userDocuments = await getStudentDocuments(user.id);
        console.log('Fetched documents:', userDocuments);
        
        // Fetch required documents
        const required = await getRequiredDocuments(user.id);
        console.log('Required documents:', required);
        
        setDocuments(userDocuments || []);
        setRequiredDocuments(required || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your documents. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  const handleUpload = async (documentType: string) => {
    // In a real implementation, this would open a file picker and upload the document
    setIsUploading(true);
    
    setTimeout(() => {
      toast({
        title: 'Upload Feature',
        description: 'Document upload functionality would be implemented here',
      });
      setIsUploading(false);
    }, 1500);
  };

  const handleViewDocument = (fileUrl: string) => {
    // Open the document in a new tab
    window.open(fileUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const filterDocuments = () => {
    if (activeTab === 'all') {
      return documents;
    } else {
      return documents.filter(doc => doc.status === activeTab);
    }
  };

  return (
    <StudentLayout title="My Documents">
      <div className="animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading documents...</span>
          </div>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <FileUp className="mr-2 h-5 w-5 text-primary" />
                  Required Documents
                </CardTitle>
                <CardDescription>
                  These documents are required for your applications. Upload them to proceed with your application process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requiredDocuments.length > 0 ? (
                    requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center border p-4 rounded-md">
                        <div className="flex-1">
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.submitted ? (
                            <>
                              {getStatusBadge(doc.status || 'pending')}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => doc.document_id && handleViewDocument(documents.find(d => d.id === doc.document_id)?.file_url || '')}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => handleUpload(doc.type)}
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No required documents found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">My Uploaded Documents</CardTitle>
                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Documents</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {filterDocuments().map((doc) => (
                      <div key={doc.id} className="border rounded-md overflow-hidden">
                        <div className="flex justify-between items-center p-4">
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 text-primary mr-3" />
                            <div>
                              <h3 className="font-medium">{doc.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatDocumentType(doc.type)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(doc.status)}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDocument(doc.file_url)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                        {doc.feedback && (
                          <div className="bg-muted p-3 border-t">
                            <p className="text-sm flex items-start">
                              <span className="font-medium mr-2">Feedback:</span>
                              {doc.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents uploaded yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload your required documents to proceed with your applications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDocuments;
