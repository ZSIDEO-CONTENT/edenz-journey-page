
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, GraduationCap, Clock, Calendar, DollarSign } from 'lucide-react';

const countries = [
  {
    id: "usa",
    name: "United States",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    universities: 200,
    courses: 5000,
    description: "The United States hosts the world's largest international student population, offering diverse study opportunities across thousands of accredited institutions.",
    features: [
      "World-class education system with globally ranked universities",
      "Cutting-edge research facilities and innovation hubs",
      "Diverse campus environments and student communities",
      "Flexible education system with numerous majors and minors",
      "Abundant scholarship and financial aid opportunities",
      "Optional Practical Training (OPT) for post-graduation work experience"
    ],
    topUniversities: [
      "Harvard University",
      "Stanford University",
      "Massachusetts Institute of Technology (MIT)",
      "California Institute of Technology",
      "University of Chicago",
      "Princeton University"
    ],
    averageTuition: "$25,000 - $60,000 per year",
    applicationDeadlines: "Early Decision: November, Regular Decision: January-February",
    visaRequirements: "F-1 Student Visa with demonstrated financial capability and academic intent"
  },
  {
    id: "uk",
    name: "United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
    universities: 150,
    courses: 4000,
    description: "The UK offers high-quality education with a strong emphasis on research and practical experience, attracting students globally with its prestigious universities.",
    features: [
      "Shorter program duration (3 years for Bachelor's, 1 year for Master's)",
      "Strong global reputation with centuries-old prestigious institutions",
      "Diverse, multicultural study environment with international student support",
      "Post-Study Work visa allowing graduates to work for 2 years",
      "Rich cultural experience with extensive history and modern innovation",
      "Strong industry connections and internship opportunities"
    ],
    topUniversities: [
      "University of Oxford",
      "University of Cambridge",
      "Imperial College London",
      "University College London (UCL)",
      "University of Edinburgh",
      "King's College London"
    ],
    averageTuition: "£10,000 - £38,000 per year",
    applicationDeadlines: "January 15 (Oxford, Cambridge), Various deadlines through UCAS",
    visaRequirements: "Tier 4 Student Visa with Confirmation of Acceptance for Studies (CAS)"
  },
  {
    id: "australia",
    name: "Australia",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be",
    universities: 40,
    courses: 3000,
    description: "Australia combines high-quality education with an excellent lifestyle, strong employment prospects, and a welcoming environment for international students.",
    features: [
      "World-class education with a focus on practical, hands-on learning",
      "Safe, welcoming environment with excellent quality of life",
      "Post-study work rights for up to 4 years",
      "Strong support services for international students",
      "Diverse range of scholarships and financial aid options",
      "Opportunities to work part-time (up to 20 hours per week) during studies"
    ],
    topUniversities: [
      "University of Melbourne",
      "Australian National University",
      "University of Sydney",
      "University of Queensland",
      "Monash University",
      "University of New South Wales"
    ],
    averageTuition: "AUD 20,000 - AUD 45,000 per year",
    applicationDeadlines: "February (Semester 1), July (Semester 2)",
    visaRequirements: "Student Visa (Subclass 500) with proof of enrollment and financial capacity"
  },
  {
    id: "canada",
    name: "Canada",
    image: "https://images.unsplash.com/photo-1569681157442-5cd435fbcd65",
    universities: 30,
    courses: 2500,
    description: "Canada offers a welcoming, safe environment for international students with high-quality education, affordable tuition, and excellent post-graduation work opportunities.",
    features: [
      "Affordable quality education compared to US and UK",
      "Strong focus on research and innovation across disciplines",
      "Post-Graduation Work Permit for up to 3 years",
      "Pathway to permanent residency for international graduates",
      "Bilingual education opportunities (English and French)",
      "Safe, multicultural environment with high quality of life"
    ],
    topUniversities: [
      "University of Toronto",
      "University of British Columbia",
      "McGill University",
      "University of Montreal",
      "University of Alberta",
      "McMaster University"
    ],
    averageTuition: "CAD 20,000 - CAD 40,000 per year",
    applicationDeadlines: "January-February (Fall intake), September-October (Winter intake)",
    visaRequirements: "Study Permit with Acceptance Letter and proof of financial support"
  }
];

const Countries = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0].id);

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
                Study Destinations
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Explore Top Study Abroad Destinations
              </h1>
              <p className="text-gray-600 text-lg">
                Discover the perfect country for your international education journey with our comprehensive guide to top study destinations.
              </p>
            </div>
          </div>
        </section>

        {/* Countries Overview */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {countries.map((country) => (
                <div 
                  key={country.id} 
                  className={`destination-card group cursor-pointer animate-fade-in ${selectedCountry === country.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedCountry(country.id)}
                >
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={country.image} 
                      alt={country.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-xl text-white font-bold mb-1">{country.name}</h3>
                      <div className="flex items-center text-white/80 text-sm space-x-3">
                        <span>{country.universities} Universities</span>
                        <span>•</span>
                        <span>{country.courses}+ Courses</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Country Detail Section */}
        <section className="py-20 bg-edenz-light/30">
          <div className="container mx-auto px-4">
            {countries.map((country) => (
              <div 
                key={country.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${selectedCountry === country.id ? 'block animate-fade-in' : 'hidden'}`}
              >
                <div className="h-80 relative">
                  <img 
                    src={country.image} 
                    alt={country.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-12">
                    <h2 className="text-4xl text-white font-bold">{country.name}</h2>
                  </div>
                </div>
                
                <div className="p-12">
                  <p className="text-gray-700 text-lg mb-8">{country.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-edenz-light/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="text-primary h-5 w-5" />
                        <h3 className="font-semibold text-lg">Universities</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary">{country.universities}+</p>
                      <p className="text-gray-600">Top institutions</p>
                    </div>
                    
                    <div className="bg-edenz-light/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="text-primary h-5 w-5" />
                        <h3 className="font-semibold text-lg">Courses</h3>
                      </div>
                      <p className="text-3xl font-bold text-primary">{country.courses}+</p>
                      <p className="text-gray-600">Diverse programs</p>
                    </div>
                    
                    <div className="bg-edenz-light/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="text-primary h-5 w-5" />
                        <h3 className="font-semibold text-lg">Tuition</h3>
                      </div>
                      <p className="text-xl font-medium text-primary">{country.averageTuition}</p>
                      <p className="text-gray-600">Average per year</p>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="features">
                    <TabsList className="mb-6">
                      <TabsTrigger value="features">Key Features</TabsTrigger>
                      <TabsTrigger value="universities">Top Universities</TabsTrigger>
                      <TabsTrigger value="admission">Admission Process</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="features" className="animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {country.features.map((feature, idx) => (
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
                    </TabsContent>
                    
                    <TabsContent value="universities" className="animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {country.topUniversities.map((uni, idx) => (
                          <div key={idx} className="bg-edenz-light/30 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Building className="text-primary h-5 w-5" />
                              <p className="font-medium">{uni}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="admission" className="animate-fade-in">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="text-primary h-5 w-5" />
                            <h3 className="font-semibold text-lg">Application Deadlines</h3>
                          </div>
                          <p className="text-gray-700">{country.applicationDeadlines}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="text-primary h-5 w-5" />
                            <h3 className="font-semibold text-lg">Visa Requirements</h3>
                          </div>
                          <p className="text-gray-700">{country.visaRequirements}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-10 text-center">
                    <Button className="btn-primary">
                      Schedule Consultation for {country.name}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Countries;
