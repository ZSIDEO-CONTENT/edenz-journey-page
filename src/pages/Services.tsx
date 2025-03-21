
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Plane, FileText, Building, Globe, Award, Users, BookMarked, FileCheck } from 'lucide-react';

const servicesData = [
  {
    id: "university-admission",
    title: "University Admissions",
    icon: <GraduationCap className="h-6 w-6" />,
    description: "We help Pakistani students secure admissions in prestigious universities across the globe, matching their academic profile with the right institutions.",
    features: [
      "Personalized university shortlisting based on academic profile and career goals",
      "Complete application assistance including SOP and LOR guidance",
      "Application fee waiver guidance where applicable",
      "Direct university application submission",
      "Regular follow-ups with universities for admission decisions"
    ],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071"
  },
  {
    id: "course-selection",
    title: "Course Selection",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Choosing the right course is crucial for your academic and career success. Our experts help you select programs that align with your interests and goals.",
    features: [
      "In-depth analysis of academic background and career aspirations",
      "Guidance on emerging fields and industry-relevant courses",
      "Information on course structure, duration, and specializations",
      "Insights on course recognition and accreditation",
      "Career prospects and potential job opportunities after graduation"
    ],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070"
  },
  {
    id: "visa-assistance",
    title: "Visa Assistance",
    icon: <Plane className="h-6 w-6" />,
    description: "Our visa experts provide comprehensive guidance to ensure a smooth visa application process with high approval rates for Pakistani students.",
    features: [
      "Complete documentation guidance and verification",
      "Financial documentation and statement preparation advice",
      "Mock visa interview preparation",
      "Regular updates on visa application status",
      "Assistance with visa extensions and renewals if needed"
    ],
    image: "https://images.unsplash.com/photo-1521920592574-51e538840cd7?q=80&w=2070"
  },
  {
    id: "test-preparation",
    title: "Test Preparation",
    icon: <BookMarked className="h-6 w-6" />,
    description: "We offer comprehensive coaching for IELTS, PTE, TOEFL, GRE, GMAT and other standardized tests required for international admissions.",
    features: [
      "Experienced instructors with proven track records",
      "Small batch sizes for personalized attention",
      "Regular mock tests and performance analysis",
      "Extensive study materials and practice resources",
      "Flexible timings including weekend and evening batches"
    ],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070"
  }
];

const Services = () => {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="hero-blob h-[600px] w-[600px] right-[-300px] top-[-100px] opacity-30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Our Services
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                End-to-End Study Abroad Solutions
              </h1>
              <p className="text-gray-600 text-lg">
                From university selection to visa processing and test preparation, Edenz Consultant provides comprehensive support at every step of your international education journey.
              </p>
            </div>
          </div>
        </section>

        {/* Services Tabs Section */}
        <section className="py-20 bg-edenz-light/30">
          <div className="container mx-auto px-4">
            <Tabs defaultValue={servicesData[0].id} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/80 p-1 rounded-xl shadow-md">
                  {servicesData.map((service) => (
                    <TabsTrigger 
                      key={service.id} 
                      value={service.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {service.icon}
                        <span className="hidden md:inline">{service.title}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {servicesData.map((service) => (
                <TabsContent key={service.id} value={service.id} className="animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                      <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                        {service.title}
                      </div>
                      <h2 className="text-3xl font-bold mb-6">{service.title}</h2>
                      <p className="text-gray-600 mb-8">{service.description}</p>
                      
                      <div className="space-y-4 mb-8">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary rounded-full p-1 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-700">{feature}</p>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="btn-primary">
                        Learn More About {service.title}
                      </Button>
                    </div>
                    
                    <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px]">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Test Preparation Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Test Preparation
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Comprehensive Test Preparation
              </h2>
              <p className="text-gray-600 text-lg">
                Achieve your target scores with our specialized test preparation programs taught by experienced instructors.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileCheck />,
                  title: "IELTS Preparation",
                  description: "Comprehensive coaching for all IELTS modules with regular mock tests and detailed feedback."
                },
                {
                  icon: <FileCheck />,
                  title: "PTE Academic",
                  description: "Expert guidance for PTE Academic with focus on scoring techniques and time management strategies."
                },
                {
                  icon: <FileCheck />,
                  title: "TOEFL iBT",
                  description: "Structured preparation program for TOEFL iBT covering all four sections with practice materials."
                },
                {
                  icon: <FileCheck />,
                  title: "GRE Coaching",
                  description: "Intensive GRE preparation focusing on Verbal, Quantitative, and Analytical Writing sections."
                },
                {
                  icon: <FileCheck />,
                  title: "GMAT Training",
                  description: "Specialized GMAT coaching for business school aspirants with emphasis on problem-solving."
                },
                {
                  icon: <FileCheck />,
                  title: "SAT Preparation",
                  description: "Comprehensive SAT preparation program for high school students applying to US universities."
                }
              ].map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-primary/10 text-primary rounded-xl p-3 inline-block mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 bg-edenz-light/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Additional Services
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Comprehensive Support Services
              </h2>
              <p className="text-gray-600 text-lg">
                Beyond our core services, we offer a range of additional support to ensure a smooth and successful study abroad experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText />,
                  title: "Documentation Assistance",
                  description: "Expert guidance on preparing all necessary documents for university applications and visa processes."
                },
                {
                  icon: <Building />,
                  title: "Accommodation Support",
                  description: "Help in finding and securing suitable on-campus or off-campus accommodation options."
                },
                {
                  icon: <Globe />,
                  title: "Pre-Departure Briefing",
                  description: "Comprehensive orientation sessions to prepare students for life and education abroad."
                },
                {
                  icon: <Users />,
                  title: "Post-Arrival Support",
                  description: "Continued assistance even after you reach your study destination to help with initial settlement."
                },
                {
                  icon: <GraduationCap />,
                  title: "Career Counseling",
                  description: "Professional guidance to align your education with your long-term career goals."
                },
                {
                  icon: <Award />,
                  title: "Scholarship Guidance",
                  description: "Assistance in identifying and applying for scholarships and financial aid opportunities."
                }
              ].map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-primary/10 text-primary rounded-xl p-3 inline-block mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
