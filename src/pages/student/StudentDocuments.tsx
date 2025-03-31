
import { useState } from 'react';
import {
  FileText, Upload, X, CheckCircle, Download, FileSearch,
  Plus, Loader2, AlertCircle, Edit
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import StudentLayout from '@/components/student/StudentLayout';

// Document categories
const documentCategories = [
  { 
    id: 'academic', 
    name: 'Academic Documents',
    description: 'Transcripts, certificates, and degrees',
    documents: [
      { id: 'transcript', name: 'Academic Transcript', status: 'uploaded', date: '2023-09-15', fileUrl: '#' },
      { id: 'degree', name: 'Bachelor Degree', status: 'rejected', date: '2023-09-10', feedback: 'Document is not clear, please upload a better quality scan' },
      { id: 'certificate', name: 'HSSC Certificate', status: 'required', date: null }
    ]
  },
  { 
    id: 'identity', 
    name: 'Identity Documents', 
    description: 'Passport, ID cards, and personal documents',
    documents: [
      { id: 'passport', name: 'Passport', status: 'verified', date: '2023-09-05', fileUrl: '#' },
      { id: 'id_card', name: 'National ID Card', status: 'pending', date: '2023-09-02', fileUrl: '#' },
      { id: 'photo', name: 'Passport-sized Photo', status: 'required', date: null }
    ] 
  },
  { 
    id: 'language', 
    name: 'Language Tests', 
    description: 'IELTS, TOEFL, and other language tests',
    documents: [
      { id: 'ielts', name: 'IELTS Certificate', status: 'uploaded', date: '2023-08-25', fileUrl: '#' }
    ] 
  },
  { 
    id: 'financial', 
    name: 'Financial Documents', 
    description: 'Bank statements, sponsorship letters',
    documents: [
      { id: 'bank', name: 'Bank Statement', status: 'required', date: null },
      { id: 'sponsorship', name: 'Sponsorship Letter', status: 'required', date: null }
    ] 
  },
  { 
    id: 'custom', 
    name: 'Custom Documents', 
    description: 'Any additional documents you need to upload',
    documents: [] 
  }
];

const StudentDocuments = () => {
  const [categories, setCategories] = useState(documentCategories);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocCategory, setCustomDocCategory] = useState('custom');
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadDocument = async (docId: string, categoryId: string) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setUploadingDocId(docId);

    try {
      // Simulate API call to upload document
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the document status in state
      const newCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            documents: category.documents.map(doc => {
              if (doc.id === docId) {
                return {
                  ...doc,
                  status: 'uploaded',
                  date: new Date().toISOString().split('T')[0],
                  fileUrl: '#'
                };
              }
              return doc;
            })
          };
        }
        return category;
      });
      
      setCategories(newCategories);
      setSelectedFile(null);
      
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded and is pending verification",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingDocId(null);
    }
  };

  const addCustomDocument = () => {
    if (!customDocName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your document",
        variant: "destructive"
      });
      return;
    }

    // Generate a unique ID from the name
    const docId = 'custom_' + customDocName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    
    // Add the custom document to the selected category
    const newCategories = categories.map(category => {
      if (category.id === customDocCategory) {
        return {
          ...category,
          documents: [
            ...category.documents,
            {
              id: docId,
              name: customDocName,
              status: 'required',
              date: null
            }
          ]
        };
      }
      return category;
    });
    
    setCategories(newCategories);
    setCustomDocName('');
    
    toast({
      title: "Document added",
      description: `${customDocName} has been added to your required documents list`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <FileSearch className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <StudentLayout title="My Documents">
      <div className="animate-fade-in">
        <Tabs defaultValue={documentCategories[0].id}>
          <div className="flex justify-between items-center mb-6">
            <TabsList className="overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Document</DialogTitle>
                  <DialogDescription>
                    Create a custom document entry for your specific needs.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="docName">Document Name</Label>
                    <Input
                      id="docName"
                      placeholder="e.g., Research Publication"
                      value={customDocName}
                      onChange={(e) => setCustomDocName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={customDocCategory}
                      onChange={(e) => setCustomDocCategory(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={addCustomDocument}>Add Document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.documents.length > 0 ? (
                      category.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg transition-all hover:shadow-sm"
                        >
                          <div className="flex items-center mb-4 md:mb-0">
                            {getStatusIcon(doc.status)}
                            <div className="ml-4">
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {doc.status === 'required' ? (
                                  'Required - Not uploaded yet'
                                ) : (
                                  <>
                                    Status: <span className="capitalize">{doc.status}</span>
                                    {doc.date && ` • Uploaded: ${doc.date}`}
                                  </>
                                )}
                                {doc.feedback && (
                                  <div className="text-red-500 mt-1">{doc.feedback}</div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {doc.status === 'required' || doc.status === 'rejected' ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Upload {doc.name}</DialogTitle>
                                    <DialogDescription>
                                      Please upload a clear, high-quality scan or photo of your document.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <Label htmlFor={`file-${doc.id}`}>Select file</Label>
                                    <Input
                                      id={`file-${doc.id}`}
                                      type="file"
                                      onChange={handleFileSelect}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Accepted formats: PDF, JPG, PNG. Max size: 5MB
                                    </p>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button 
                                      onClick={() => uploadDocument(doc.id, category.id)}
                                      disabled={!selectedFile || uploadingDocId === doc.id}
                                    >
                                      {uploadingDocId === doc.id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Uploading...
                                        </>
                                      ) : (
                                        'Upload Document'
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <>
                                {doc.fileUrl && (
                                  <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                )}
                                <Button variant="outline">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Replace
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No documents in this category yet.</p>
                        <p className="text-sm mt-2">
                          Click "Add Custom Document" to add a document to this category.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentDocuments;
