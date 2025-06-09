
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Message sent successfully!',
        description: 'We will get back to you within 24 hours.',
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 to-blue-50 w-full">
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Get In Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Ready to start your study abroad journey? Get in touch with our expert consultants for personalized guidance and support.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-20 w-full">
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Information */}
                <div className="space-y-8">
                  <div className="text-left">
                    <h2 className="text-3xl font-bold mb-6 text-left">Get in Touch</h2>
                    <p className="text-gray-600 text-lg mb-8 text-left">
                      Visit our office or reach out through any of the following channels. Our team is here to help you achieve your study abroad dreams.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 text-primary rounded-xl p-3 flex-shrink-0">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg mb-1 text-left">Office Address</h3>
                        <p className="text-gray-600 text-left">627/B, opp. Pak Turk Muraif School, Lahore, 54000</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 text-primary rounded-xl p-3 flex-shrink-0">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg mb-1 text-left">Phone Number</h3>
                        <a href="tel:+923334229697" className="text-gray-600 hover:text-primary transition-colors">
                          +92 333 4229697
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 text-primary rounded-xl p-3 flex-shrink-0">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg mb-1 text-left">Email Address</h3>
                        <a href="mailto:info@edenzconsultant.org" className="text-gray-600 hover:text-primary transition-colors">
                          info@edenzconsultant.org
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 text-primary rounded-xl p-3 flex-shrink-0">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg mb-1 text-left">Office Hours</h3>
                        <div className="text-gray-600 text-left">
                          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p>Saturday: 10:00 AM - 4:00 PM</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+92 XXX XXXXXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="How can we help you?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your study abroad goals..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google Maps Section */}
        <section className="py-20 bg-gray-50 w-full">
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Find Us on the Map</h2>
                <p className="text-gray-600 text-lg">
                  Visit our office for in-person consultations and personalized guidance.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-96 w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27215.00686531066!2d74.2405!3d31.5178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190131b1a3e2d1%3A0x4c76e40c74c7d7a8!2sEdenz%20Consultant%20-%20Study%20Abroad%20Consultancy!5e0!3m2!1sen!2s!4v1704718800000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Edenz Consultant Office Location - 627/B, opp. Pak Turk Muraif School, Lahore"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
