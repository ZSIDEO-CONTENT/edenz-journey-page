
import { useState, useEffect } from 'react';
import { 
  Sparkles, School, GraduationCap, Globe, 
  BarChart3, ArrowRight, BookOpen, TrendingUp,
  FileText, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StudentLayout from '@/components/student/StudentLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const StudentRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [generatingNew, setGeneratingNew] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [documentsComplete, setDocumentsComplete] = useState(false);
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);

  useEffect(() => {
    // Check if user is authenticated and get profile data
    const userString = localStorage.getItem('studentUser');
    const tokenString = localStorage.getItem('studentToken');
    
    if (!userString || !tokenString) {
      setIsLoading(false);
      return;
    }
    
    const user = JSON.parse(userString);
    setUserProfile(user);
    
    const checkProfileAndFetchData = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        
        if (token && user.id) {
          // Fetch onboarding progress to check profile completion
          const onboardingResponse = await fetch(`http://localhost:8000/api/student/onboarding-steps/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (onboardingResponse.ok) {
            const onboardingData = await onboardingResponse.json();
            const progress = onboardingData.progress || 0;
            setProfileCompletionPercentage(progress);
            setProfileComplete(progress >= 70);
            
            // Check if documents are uploaded
            const documentsResponse = await fetch(`http://localhost:8000/api/documents/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (documentsResponse.ok) {
              const documentsData = await documentsResponse.json();
              // Consider documents complete if at least 3 required documents are uploaded
              setDocumentsComplete(documentsData && documentsData.length >= 3);
            }
            
            // Only fetch recommendations if profile is complete enough
            if (progress >= 70) {
              const recommendationsResponse = await fetch(`http://localhost:8000/api/recommendations/${user.id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (recommendationsResponse.ok) {
                const recommendationsData = await recommendationsResponse.json();
                setRecommendations(recommendationsData || []);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkProfileAndFetchData();
  }, []);

  const handleGenerateNewRecommendations = async () => {
    if (!userProfile || !userProfile.id) return;
    
    setGeneratingNew(true);
    
    try {
      const token = localStorage.getItem('studentToken');
      
      if (token) {
        // Make API call to generate new recommendations
        const response = await fetch('http://localhost:8000/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            student_id: userProfile.id,
            education_level: userProfile.education_level,
            preferred_countries: userProfile.preferred_countries,
            preferred_fields: userProfile.preferred_fields,
            budget: userProfile.budget
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setGeneratingNew(false);
    }
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

  // If profile or documents are not complete, show prompt instead of recommendations
  const renderIncompleteProfileMessage = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
          Profile Incomplete
        </CardTitle>
        <CardDescription>
          Complete your profile to get personalized AI recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium">{profileCompletionPercentage}%</span>
            </div>
            <Progress value={profileCompletionPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              We need more information about you to provide accurate recommendations.
              Please complete your profile information.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
            <h3 className="font-medium flex items-center text-amber-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              Required for AI Recommendations
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-700">
              <li className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${profileComplete ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></div>
                Complete your profile (at least 70%)
              </li>
              <li className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${documentsComplete ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></div>
                Upload required documents
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to="/student/profile">
          <Button variant="outline">Complete Profile</Button>
        </Link>
        <Link to="/student/documents">
          <Button>Upload Documents</Button>
        </Link>
      </CardFooter>
    </Card>
  );

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
            {profileComplete && documentsComplete && (
              <Button
                onClick={handleGenerateNewRecommendations}
                disabled={generatingNew || isLoading}
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
            )}
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
          ) : !profileComplete || !documentsComplete ? (
            renderIncompleteProfileMessage()
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
              
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
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
                          <span className="text-sm font-medium">{rec.match_percentage}% Match</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{rec.description}</p>
                      
                      {rec.type === 'university' && rec.location && (
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Globe className="h-4 w-4 mr-2" />
                          <span>{rec.location}</span>
                        </div>
                      )}
                      
                      {expandedId === rec.id && rec.details && (
                        <div className="mt-4 pt-4 border-t animate-fade-in">
                          <h4 className="font-medium mb-2">Details</h4>
                          <div className="space-y-2">
                            {Object.entries(rec.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-sm font-medium capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                </span>{' '}
                                <span className="text-sm text-muted-foreground">{String(value)}</span>
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
                ))
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Recommendations Yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        We haven't generated any recommendations for you yet. Click the button below to get personalized AI-powered recommendations.
                      </p>
                      <Button onClick={handleGenerateNewRecommendations} disabled={generatingNew}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Recommendations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                  <span className="text-sm font-medium">{documentsComplete ? '80%' : '40%'}</span>
                </div>
                <Progress value={documentsComplete ? 80 : 40} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {documentsComplete 
                    ? 'Key documents uploaded. Consider adding additional supporting documents.' 
                    : 'Upload your remaining documents to improve your profile completeness.'}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">English Proficiency</span>
                  <span className="text-sm font-medium">{userProfile?.english_score ? '100%' : '0%'}</span>
                </div>
                <Progress value={userProfile?.english_score ? 100 : 0} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {userProfile?.english_score 
                    ? `Your ${userProfile.test_type || 'English'} score is good.` 
                    : 'Add your IELTS/TOEFL score to your profile.'}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Educational Background</span>
                  <span className="text-sm font-medium">{profileComplete ? '85%' : '50%'}</span>
                </div>
                <Progress value={profileComplete ? 85 : 50} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {profileComplete
                    ? 'Your academic background is strong. Consider adding relevant projects or publications.' 
                    : 'Complete your educational history in your profile.'}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/student/profile">
              <Button variant="outline">Update Profile</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentRecommendations;
