import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2, Users } from "lucide-react";
import { registerProcessingMember } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(5, "Phone number is required"),
  managed_regions: z.array(z.string()).optional(),
});

const regions = [
  { id: "uk", label: "United Kingdom" },
  { id: "usa", label: "United States" },
  { id: "canada", label: "Canada" },
  { id: "australia", label: "Australia" },
  { id: "europe", label: "Europe" },
  { id: "asia", label: "Asia" },
  { id: "middle_east", label: "Middle East" },
];

const ProcessingRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      managed_regions: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast({
          title: "Authentication error",
          description: "Admin token not found. Please log in again.",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }
      
      await registerProcessingMember({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        managed_regions: values.managed_regions
      }, adminToken);
      
      toast({
        title: "Success!",
        description: "Processing team member has been registered",
      });
      
      form.reset();
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register processing team member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Register Processing Team Member</CardTitle>
          </div>
          <CardDescription>
            Create a new account for a processing team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be at least 6 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="managed_regions"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Managed Regions</FormLabel>
                      <FormDescription>
                        Select the regions this processing team member will manage
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {regions.map((region) => (
                        <FormField
                          key={region.id}
                          control={form.control}
                          name="managed_regions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={region.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(region.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], region.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== region.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {region.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <CardFooter className="px-0">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Processing Team Member"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingRegister;
