import { useState } from 'react';
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

interface Education {
  degree: string;
  institution: string;
  yearCompleted: string;
  gpa: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  profileImage: string;
  bio: string;
  education: Education[];
  skills: string[];
}

const sampleUserData: UserData = {
  name: 'Muhammad Ali',
  email: 'muhammad.ali@example.com',
  phone: '+92 300 1234567',
  address: 'House #123, Street 5, F-7/3, Islamabad, Pakistan',
  dob: '1998-05-15',
  profileImage: '',
  bio: 'Computer Science student seeking to pursue Masters abroad. Interested in Artificial Intelligence and Machine Learning.',
  education: [
    {
      degree: 'Bachelors in Computer Science',
      institution: 'FAST National University',
      yearCompleted: '2022',
      gpa: '3.8/4.0'
    }
  ],
  skills: ['Python', 'JavaScript', 'Machine Learning', 'Data Analysis']
};

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
  yearCompleted: z.string().min(4, 'Year is required'),
  gpa: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type EducationFormValues = z.infer<typeof educationFormSchema>;

const StudentProfile = () => {
  const [userData, setUserData] = useState<UserData>(sampleUserData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      dob: userData.dob,
      bio: userData.bio,
    },
  });

  const educationForm = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      degree: userData.education[0]?.degree || '',
      institution: userData.education[0]?.institution || '',
      yearCompleted: userData.education[0]?.yearCompleted || '',
      gpa: userData.education[0]?.gpa || '',
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user data
      setUserData({
        ...userData,
        ...values
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully',
      });
    } catch (error) {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update education data with non-optional values
      setUserData({
        ...userData,
        education: [values as Education]
      });
      
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
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result) {
          setUserData({
            ...userData,
            profileImage: reader.result.toString(),
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

  return (
    <StudentLayout title="My Profile">
      <div className="animate-fade-in">
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
                      <AvatarImage src={userData.profileImage} />
                      <AvatarFallback className="text-2xl">
                        {userData.name.charAt(0).toUpperCase()}
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
                        name="yearCompleted"
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
                      {userData.skills.map((skill, index) => (
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
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
