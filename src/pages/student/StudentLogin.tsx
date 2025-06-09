
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { studentLogin } from '@/lib/api';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const StudentLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Remove automatic auth check that was causing redirects

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Use the studentLogin function instead of direct fetch
      await studentLogin(values.email, values.password);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to your student portal',
      });
      
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md space-y-8 bg-background rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Student Portal Login</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your documents and application status
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/student/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
          
          <Link to="/" className="block mt-4 text-sm text-primary hover:underline">
            Back to home
          </Link>
          
          <Button
            variant="link"
            onClick={() => navigate("/student/dashboard")}
            className="mt-2"
          >
            Skip to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
