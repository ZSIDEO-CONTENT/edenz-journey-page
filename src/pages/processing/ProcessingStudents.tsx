
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Search, Filter, ChevronDown, FileText, BookOpen, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProcessingLayout from '@/components/processing/ProcessingLayout';
import { useToast } from '@/hooks/use-toast';
import { getAllStudents } from '@/lib/api';

const ProcessingStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await getAllStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error',
          description: 'Failed to load students data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student: any) => 
        student.name.toLowerCase().includes(query) || 
        student.email.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  };

  // Handle filter by country
  const handleFilterByCountry = (country: string) => {
    if (country === 'all') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student: any) => 
        student.preferred_country === country
      );
      setFilteredStudents(filtered);
    }
  };

  return (
    <ProcessingLayout title="All Students">
      <div className="space-y-6">
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email"
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleFilterByCountry('all')}>
                All Countries
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByCountry('uk')}>
                United Kingdom
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByCountry('usa')}>
                United States
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByCountry('canada')}>
                Canada
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByCountry('australia')}>
                Australia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading students...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((student: any) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-medium">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">{student.phone}</p>
                      <p className="text-sm mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {student.preferred_country || 'No country selected'}
                        </span>
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex items-center gap-2 text-sm mr-6">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>{student.document_count || 0} Documents</span>
                        </div>
                        <div className="flex items-center ml-4">
                          <BookOpen className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>{student.application_count || 0} Applications</span>
                        </div>
                      </div>
                      <Link to={`/processing/student/${student.id}`}>
                        <Button>View Profile</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </ProcessingLayout>
  );
};

export default ProcessingStudents;
