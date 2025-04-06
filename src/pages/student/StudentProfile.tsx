import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, Mail, Phone, Map, Calendar, Loader2, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StudentLayout from '@/components/student/StudentLayout';
import { getStudentProfile, updateStudentProfile, getStudentEducation } from '@/lib/api';

interface Education {
  degree: string;
  institution: string;
  year_completed: string;
  gpa: string;
  country?: string;
  major?: string;
  start_date?: string;
  end_date?: string;
  id?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  profile_picture: string;
  bio: string;
  education: Education[];
  skills: string[];
  preferred_country?: string;
  funding_source?: string;
  budget?: string;
}

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  dob: z.string(),
  bio: z.string().max(300, 'Bio must be less than 300 characters'),
});

const educationFormSchema = z.object({
  degree: z.string().min(2, 'Degree name is required'),
  institution: z.string().min(2, 'Institution name is required'),
  year_completed: z.string().min(4, 'Year is required'),
  gpa: z.string(),
  country: z.string().optional(),
  major: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type EducationFormValues = z.infer<typeof educationFormSchema>;

const StudentProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
      bio: '',
    },
  });

  const educationForm = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      degree: '',
      institution: '',
      year_completed: '',
      gpa: '',
      country: '',
      major: '',
      start_date: '',
      end_date: '',
    },
  });
  
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setIsPageLoading(true);
        
        // Get user info from localStorage
        const userString = localStorage.getItem('studentUser');
        const tokenString = localStorage.getItem('studentToken');
        
        if (!userString || !tokenString) {
          throw new Error('User data not found');
        }
        
        const user = JSON.parse(userString);
        
        // Fetch user profile data
        const profileData = await getStudentProfile(user.id);
        console.log('Fetched profile data:', profileData);
        
        if (!profileData || profileData.error) {
          throw new Error(profileData?.error || 'Could not fetch profile data');
        }
        
        // Fetch education data
        const educationResult = await getStudentEducation(user.id).catch(err => {
          console.warn("Could not fetch education data:", err);
          return [];
        });
        
        // Set the user data
        setUserData({
          id: user.id,
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          dob: profileData.dob || '',
          profile_picture: profileData.profile_picture || '',
          bio: profileData.bio || '',
          preferred_country: profileData.preferred_country || '',
          funding_source: profileData.funding_source || '',
          budget: profileData.budget || '',
          education: educationResult || [],
          skills: profileData.skills || []
        });
        
        setEducationData(educationResult || []);
        
        // Update form with fetched data
        profileForm.reset({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          dob: profileData.dob || '',
          bio: profileData.bio || '',
        });
        
        // If education data exists, update education form
        if (educationResult && educationResult.length > 0) {
          educationForm.reset({
            degree: educationResult[0].degree || '',
            institution: educationResult[0].institution || '',
            year_completed: educationResult[0].year_completed || '',
            gpa: educationResult[0].gpa || '',
            country: educationResult[0].country || '',
            major: educationResult[0].major || '',
            start_date: educationResult[0].start_date || '',
            end_date: educationResult[0].end_date || '',
          });
        }
        
      } catch (error) {
        console.error('Error loading student profile:', error);
        toast({
          title: 'Error loading profile',
          description: 'Could not load your profile data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchStudentProfile();
  }, [toast]);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      if (!userData) {
        throw new Error('User data not available');
      }
      
      // Update user data in the API
      const result = await updateStudentProfile(userData.id, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        dob: values.dob,
        bio: values.bio,
        profile_picture: userData.profile_picture,
        preferred_country: userData.preferred_country,
        funding_source: userData.funding_source,
        budget: userData.budget,
      });
      
      if (!result || result.error) {
        throw new Error(result?.error || 'Failed to update profile');
      }
      
      // Update local state
      setUserData({
        ...userData,
        ...values
      });
      
      // Update the user data in localStorage to keep it in sync
      const userString = localStorage.getItem('studentUser');
      if (userString) {
        const user = JSON.parse(userString);
        localStorage.setItem('studentUser', JSON.stringify({
          ...user,
          name: values.name,
          email: values.email
        }));
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating your profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onEducationSubmit = async (values: EducationFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would update the education information in the API
      // For now, we'll just update the local state
      
      if (!userData) {
        throw new Error('User data not available');
      }
      
      // Update education data
      const updatedEducation = [{
        degree: values.degree,
        institution: values.institution,
        year_completed: values.year_completed,
        gpa: values.gpa,
        country: values.country,
        major: values.major,
        start_date: values.start_date,
        end_date: values.end_date,
      }];
      
      setUserData({
        ...userData,
        education: updatedEducation
      });
      
      setEducationData(updatedEducation);
      
      toast({
        title: 'Education updated',
        description: 'Your education information has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error updating your education information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && userData) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result && userData) {
          setUserData({
            ...userData,
            profile_picture: reader.result.toString(),
          });
          
          toast({
            title: 'Profile image updated',
            description: 'Your profile image has been updated successfully',
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  if (isPageLoading) {
    return (
      <StudentLayout title="My Profile">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading profile...</span>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Profile">
      <div className="animate-fade-in">
        {isPageLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading profile...</span>
          </div>
        ) : (
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here. This information will be used for your applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center">
                      <Avatar className="h-24 w-24 mb-4 relative group">
                        <AvatarImage src={userData?.profile_picture} />
                        <AvatarFallback className="text-2xl">
                          {userData?.name?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                        <label
                          htmlFor="profileImage"
                          className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                        >
                          <Camera className="h-8 w-8" />
                        </label>
                        <input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileImageUpload}
                        />
                      </Avatar>
                      <p className="text-sm text-muted-foreground">
                        Click to upload a profile picture
                      </p>
                    </div>
                    
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your email address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about yourself and your study goals" 
                                  className="resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                This will help our consultants better understand your goals.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background for your applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...educationForm}>
                    <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={educationForm.control}
                          name="degree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree/Qualification</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Bachelors in Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={educationForm.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., FAST National University" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={educationForm.control}
                          name="year_completed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Completed</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 2022" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={educationForm.control}
                          name="gpa"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GPA/Percentage</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 3.8/4.0 or 85%" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={educationForm.control}
                          name="major"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Major/Specialization</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={educationForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., United States" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={educationForm.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={educationForm.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Education'
                        )}
                      </Button>
                    </form>
                  </Form>
                  
                  {educationData.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Education History</h3>
                      <div className="space-y-4">
                        {educationData.map((edu, index) => (
                          <div key={index} className="p-4 border rounded-md">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{edu.degree}</h4>
                              <span className="text-sm text-muted-foreground">{edu.year_completed}</span>
                            </div>
                            <p>{edu.institution}{edu.country ? `, ${edu.country}` : ''}</p>
                            {edu.major && <p className="text-sm">Major: {edu.major}</p>}
                            <p className="text-sm">GPA: {edu.gpa}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Interests</CardTitle>
                  <CardDescription>
                    Add your skills and interests to help us match you with suitable programs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Your Skills</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {userData?.skills && userData.skills.map((skill, index) => (
                          <div 
                            key={index} 
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {skill}
                            <button className="ml-2 text-primary/70 hover:text-primary">
                              ×
                            </button>
                          </div>
                        ))}
                        {(!userData?.skills || userData.skills.length === 0) && (
                          <p className="text-sm text-muted-foreground">No skills added yet</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Add a new skill" 
                        className="flex-1" 
                      />
                      <Button variant="outline">Add</Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Your skills help us recommend programs that match your strengths.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Skills</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
