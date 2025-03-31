
import { useState, useEffect } from 'react';
import { 
  Sparkles, School, GraduationCap, Globe, 
  BarChart3, ArrowRight, BookOpen, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StudentLayout from '@/components/student/StudentLayout';

// Sample recommendation data
const sampleRecommendations = [
  {
    id: 1,
    type: 'university',
    title: 'University of Glasgow',
    subtitle: 'MSc Data Science',
    description: 'Based on your background in Computer Science and interest in Machine Learning, the MSc Data Science program at the University of Glasgow would be an excellent fit.',
    matchPercentage: 92,
    location: 'Scotland, UK',
    details: {
      fees: '£24,000 per year',
      duration: '1 year',
      requirements: '2:1 (or equivalent) in Computer Science, Mathematics or related field, IELTS: 6.5',
      applicationDeadline: 'June 30, 2024'
    }
  },
  {
    id: 2,
    type: 'university',
    title: 'Technical University of Munich',
    subtitle: 'MSc Informatics',
    description: 'Your strong academic background and programming skills make you a good candidate for this program, which has strengths in AI and Machine Learning.',
    matchPercentage: 85,
    location: 'Munich, Germany',
    details: {
      fees: '€3,000 per year (administrative fees)',
      duration: '2 years',
      requirements: 'Bachelor in Computer Science, Mathematics, or Engineering. German A1 and English B2.',
      applicationDeadline: 'May 31, 2024'
    }
  },
  {
    id: 3,
    type: 'improvement',
    title: 'Improve your IELTS score',
    subtitle: 'Target: 7.0 in all bands',
    description: 'Your current IELTS score is 6.5. Improving to 7.0 would open up more university options and scholarship opportunities.',
    matchPercentage: 100,
    details: {
      currentScore: '6.5 overall (Reading: 7.0, Listening: 6.5, Writing: 6.0, Speaking: 6.5)',
      recommendation: 'Focus on improving writing skills',
      resources: 'Edenz IELTS preparation course, IELTS Writing practice with feedback'
    }
  },
  {
    id: 4,
    type: 'scholarship',
    title: 'British Council GREAT Scholarship',
    subtitle: '£10,000 towards tuition fees',
    description: 'You may be eligible for this scholarship which is available for Pakistani students applying to participating UK universities.',
    matchPercentage: 75,
    details: {
      eligibility: 'Pakistani nationals applying to participating UK universities',
      application: 'Apply through the university after receiving an offer',
      deadline: 'Varies by university, typically April-May 2024'
    }
  }
];

const StudentRecommendations = () => {
  const [recommendations, setRecommendations] = useState(sampleRecommendations);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [generatingNew, setGeneratingNew] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateNewRecommendations = () => {
    setGeneratingNew(true);
    
    // Simulate generating new recommendations
    setTimeout(() => {
      setGeneratingNew(false);
    }, 3000);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'university':
        return <School className="h-5 w-5 text-primary" />;
      case 'improvement':
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case 'scholarship':
        return <GraduationCap className="h-5 w-5 text-green-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <StudentLayout title="AI Recommendations">
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary animate-pulse-slow" />
                AI-Powered Recommendations
              </h2>
              <p className="text-muted-foreground">
                Personalized suggestions based on your profile and documents
              </p>
            </div>
            <Button
              onClick={handleGenerateNewRecommendations}
              disabled={generatingNew}
              className="relative"
            >
              {generatingNew ? (
                <>
                  <div className="absolute inset-0 bg-primary/20 rounded-md animate-pulse"></div>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Refresh Recommendations
                </>
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-muted rounded-full w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded-full w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-muted rounded-md w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {generatingNew && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center animate-pulse">
                  <Sparkles className="h-5 w-5 text-primary mr-3 animate-spin" />
                  <div>
                    <p className="font-medium">Generating new recommendations...</p>
                    <p className="text-sm text-muted-foreground">
                      Our AI is analyzing your profile and finding the best opportunities
                    </p>
                  </div>
                </div>
              )}
              
              {recommendations.map((rec) => (
                <Card 
                  key={rec.id} 
                  className={`hover:shadow-md transition-all duration-300 ${
                    expandedId === rec.id ? 'ring-1 ring-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {getRecommendationIcon(rec.type)}
                          <span className="ml-2">{rec.title}</span>
                        </CardTitle>
                        <CardDescription>{rec.subtitle}</CardDescription>
                      </div>
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{rec.matchPercentage}% Match</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{rec.description}</p>
                    
                    {rec.type === 'university' && (
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Globe className="h-4 w-4 mr-2" />
                        <span>{rec.location}</span>
                      </div>
                    )}
                    
                    {expandedId === rec.id && (
                      <div className="mt-4 pt-4 border-t animate-fade-in">
                        <h4 className="font-medium mb-2">Details</h4>
                        <div className="space-y-2">
                          {Object.entries(rec.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-sm font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>{' '}
                              <span className="text-sm text-muted-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                    >
                      {expandedId === rec.id ? 'Show Less' : 'Show More'}
                    </Button>
                    
                    {rec.type === 'university' && (
                      <Button className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    )}
                    
                    {rec.type === 'improvement' && (
                      <Button variant="outline" className="flex items-center">
                        Get Help <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                    
                    {rec.type === 'scholarship' && (
                      <Button variant="outline" className="flex items-center">
                        Check Eligibility <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <Card className="bg-primary/5 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              Profile Improvement Suggestions
            </CardTitle>
            <CardDescription>Ways to strengthen your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Document Completeness</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <Progress value={70} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your remaining documents to improve your profile completeness.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">English Proficiency</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  Consider retaking your IELTS to achieve a higher score.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Educational Background</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  Your academic background is strong. Consider adding relevant projects or publications.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">View Full Assessment</Button>
          </CardFooter>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentRecommendations;
