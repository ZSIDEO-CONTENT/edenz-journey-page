
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Filter, Search, ChevronDown, ArrowUpRight, Loader2, Plus
} from 'lucide-react';
import ProcessingLayout from '@/components/processing/ProcessingLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  student_id: string;
  student_name?: string;
  university_name: string;
  program_name: string;
  status: string;
  progress: number;
  intake: string;
  created_at: string;
  updated_at: string;
  application_fee?: number;
  tuition_fee?: number;
  estimated_living_cost?: number;
  documents_required?: string[];
  notes?: string;
}

const ProcessingApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        
        // This would be replaced with a real API call to fetch applications
        // For now, let's use some mock data
        const mockApplications: Application[] = [
          {
            id: '1',
            student_id: '101',
            student_name: 'John Smith',
            university_name: 'University of London',
            program_name: 'MSc Computer Science',
            status: 'in_progress',
            progress: 45,
            intake: 'Fall 2025',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            student_id: '102',
            student_name: 'Emma Johnson',
            university_name: 'Oxford University',
            program_name: 'PhD Economics',
            status: 'pending',
            progress: 25,
            intake: 'Spring 2025',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            student_id: '103',
            student_name: 'Michael Chen',
            university_name: 'University of Toronto',
            program_name: 'BBA Finance',
            status: 'completed',
            progress: 100,
            intake: 'Fall 2025',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        
        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load applications data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter((app) => 
        app.university_name.toLowerCase().includes(query) || 
        app.program_name.toLowerCase().includes(query) ||
        app.student_name?.toLowerCase().includes(query)
      );
      setFilteredApplications(filtered);
    }
  };

  // Handle filter by status
  const handleFilterByStatus = (status: string) => {
    if (status === 'all') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter((app) => app.status === status);
      setFilteredApplications(filtered);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  // Navigate to create application form
  const navigateToStudentView = (studentId: string) => {
    navigate(`/processing/student/${studentId}`);
  };

  return (
    <ProcessingLayout title="Student Applications">
      <div className="space-y-6">
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by university, program, or student"
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleFilterByStatus('all')}>
                  All Applications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByStatus('in_progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByStatus('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByStatus('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByStatus('rejected')}>
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading applications...</p>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium">{application.university_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{application.program_name}</p>
                      <p className="text-sm mt-1">Student: {application.student_name}</p>
                      <p className="text-sm text-muted-foreground">Intake: {application.intake}</p>
                      
                      {/* Progress bar */}
                      <div className="mt-2 w-full md:max-w-md">
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Application Progress</span>
                          <span>{application.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${application.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigateToStudentView(application.student_id)}
                      >
                        View Student
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">Update Status</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Application Status</DialogTitle>
                            <DialogDescription>
                              {application.university_name} - {application.program_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="status">Application Status</Label>
                              <select 
                                id="status" 
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                defaultValue={application.status}
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="progress">Progress (%)</Label>
                              <Input 
                                id="progress" 
                                type="number" 
                                min="0" 
                                max="100" 
                                defaultValue={application.progress} 
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="notes">Update Notes</Label>
                              <textarea 
                                id="notes" 
                                className="min-h-20 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                                placeholder="Add some notes about this update..."
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={() => {
                              toast({
                                title: "Application updated",
                                description: "The application status has been updated successfully",
                              });
                            }}>
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </ProcessingLayout>
  );
};

export default ProcessingApplications;
