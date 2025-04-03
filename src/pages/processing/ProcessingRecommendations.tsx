
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BarChart3, Loader2, ArrowLeft, Lightbulb, School, GraduationCap,
  DollarSign, Percent, Info, Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProcessingLayout from '@/components/processing/ProcessingLayout';
import { useToast } from '@/hooks/use-toast';
import { getStudentRecommendations, generateStudentRecommendation, getStudentDetails } from '@/lib/api';

const ProcessingRecommendations = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (!studentId) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get student details
        const studentData = await getStudentDetails(studentId);
        setStudent(studentData.profile);
        
        // Get recommendations
        const recommendationsData = await getStudentRecommendations(studentId);
        setRecommendations(recommendationsData || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recommendations',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId, toast]);

  const handleGenerateRecommendation = async () => {
    if (!studentId) return;
    
    try {
      setIsGenerating(true);
      
      await generateStudentRecommendation(studentId);
      
      toast({
        title: 'Recommendation generated',
        description: 'New AI recommendation has been generated successfully',
      });
      
      // Refresh recommendations
      const recommendationsData = await getStudentRecommendations(studentId);
      setRecommendations(recommendationsData || []);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate recommendation',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProcessingLayout title="Student Recommendations">
      <div className="space-y-6">
        {/* Back button and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link to={`/processing/student/${studentId}`} className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Student Profile</span>
          </Link>
          
          <Button 
            onClick={handleGenerateRecommendation}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate New Recommendation
              </>
            )}
          </Button>
        </div>
        
        {/* Student info */}
        {student && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recommendations for {student.name}</CardTitle>
              <CardDescription>
                AI-generated recommendations based on the student's profile, academic background, and preferences
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        
        {/* Recommendations */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading recommendations...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={rec.type === 'university' ? 'default' : rec.type === 'improvement' ? 'secondary' : 'outline'}>
                      {rec.type}
                    </Badge>
                    <div className="flex items-center">
                      <Percent className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-medium">{rec.match_percentage}% Match</span>
                    </div>
                  </div>
                  <CardTitle>{rec.title}</CardTitle>
                  <CardDescription>{rec.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{rec.description}</p>
                  
                  {rec.type === 'university' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-start">
                        <School className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm">{rec.details.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Fees</p>
                          <p className="text-sm">{rec.details.fees}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <GraduationCap className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm">{rec.details.duration}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {rec.type === 'improvement' && (
                    <div className="flex items-start">
                      <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium">Recommendation</p>
                        <p className="text-sm">{rec.details.recommendation}</p>
                      </div>
                    </div>
                  )}
                  
                  {rec.type === 'scholarship' && (
                    <div className="flex items-start">
                      <Star className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium">Award Amount</p>
                        <p className="text-sm">{rec.details.award || 'Varies based on eligibility'}</p>
                      </div>
                    </div>
                  )}
                  
                  {rec.details.notes && (
                    <div className="flex items-start pt-2 border-t">
                      <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <p className="text-sm italic">{rec.details.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
            <p className="text-muted-foreground mb-6">No AI recommendations have been generated yet</p>
            <Button onClick={handleGenerateRecommendation} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : 'Generate First Recommendation'}
            </Button>
          </Card>
        )}
      </div>
    </ProcessingLayout>
  );
};

export default ProcessingRecommendations;
