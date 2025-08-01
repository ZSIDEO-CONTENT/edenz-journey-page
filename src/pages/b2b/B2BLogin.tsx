
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { b2bLogin, isB2BAuthenticated } from "@/lib/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Building2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const B2BLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      if (await isB2BAuthenticated()) {
        navigate("/b2b/dashboard");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await b2bLogin(values.email, values.password);
      
      toast({
        title: "Login successful",
        description: "Welcome to the B2B partner portal",
      });
      
      navigate("/b2b/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold">B2B Partner Portal</h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
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
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Contact the administrator for B2B account access.</p>
        </div>
      </div>
    </div>
  );
};

export default B2BLogin;
