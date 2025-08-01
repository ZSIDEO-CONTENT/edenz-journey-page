import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, GraduationCap, Clock, Calendar, DollarSign, Globe } from 'lucide-react';

const countries = [
  {
    id: "usa",
    name: "United States",
    image: "images/us.jpg",
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
    image: "images/uk.jpg",
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
    image: "images/australia.jpg",
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
    image: "images/canada.jpg",
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
  },
  {
    id: "germany",
    name: "Germany",
    image: "images/germany.jpg",
    universities: 45,
    courses: 2800,
    description: "Germany offers world-class education with minimal to no tuition fees at public universities, making it an excellent destination for international students seeking quality education.",
    features: [
      "Free or low-cost tuition at public universities",
      "Strong emphasis on research and innovation",
      "Growing number of English-taught programs",
      "18-month post-study work visa",
      "Strong economy with internship and job opportunities",
      "High quality of life and affordable living costs"
    ],
    topUniversities: [
      "Technical University of Munich",
      "Ludwig Maximilian University of Munich",
      "Heidelberg University",
      "Humboldt University of Berlin",
      "RWTH Aachen University",
      "Free University of Berlin"
    ],
    averageTuition: "€0 - €3,000 per year",
    applicationDeadlines: "Winter Semester: July 15, Summer Semester: January 15",
    visaRequirements: "Student Visa with proof of financial resources (€10,332 per year) and admission letter"
  },
  {
    id: "newZealand",
    name: "New Zealand",
    image: "images/newzealand.jpg",
    universities: 25,
    courses: 1800,
    description: "New Zealand offers a world-class education system with a focus on research and practical skills, all within a safe, welcoming environment with stunning natural beauty.",
    features: [
      "Globally recognized qualifications with practical, hands-on learning",
      "Safe, welcoming environment with excellent quality of life",
      "Post-study work visa for up to 3 years",
      "Opportunities to work while studying (up to 20 hours per week)",
      "Beautiful natural landscapes and outdoor lifestyle",
      "Strong support services for international students"
    ],
    topUniversities: [
      "University of Auckland",
      "University of Otago",
      "Victoria University of Wellington",
      "University of Canterbury",
      "Massey University",
      "Auckland University of Technology"
    ],
    averageTuition: "NZD 22,000 - NZD 35,000 per year",
    applicationDeadlines: "February (Semester 1), July (Semester 2)",
    visaRequirements: "Student Visa with proof of funds, acceptance letter, and return airfare"
  },
  {
  id: "ireland",
  name: "Ireland",
  image: "images/ireland.jpg",
  universities: 22,
  courses: 1500,
  description: "Ireland offers a vibrant educational experience with top-ranked universities, strong industry ties, and a welcoming atmosphere for international students.",
  features: [
    "English-speaking country with globally recognized degrees",
    "Strong focus on research and innovation, especially in tech and pharmaceuticals",
    "Safe, student-friendly cities with rich cultural heritage",
    "Post-study work opportunities via Ireland's Graduate Scheme",
    "Close ties with global companies like Google, Apple, and Facebook",
    "Affordable tuition fees compared to other Western countries"
  ],
  topUniversities: [
    "Trinity College Dublin",
    "University College Dublin",
    "University College Cork",
    "National University of Ireland Galway",
    "Dublin City University",
    "University of Limerick"
  ],
  averageTuition: "$10,000 - $25,000 per year",
  applicationDeadlines: "Varies by university, generally between February and July",
  visaRequirements: "Irish Study Visa with proof of funds, acceptance letter, and private medical insurance"
},
{
  id: "sweden",
  name: "Sweden",
  image: "images/sweden.jpg",
  universities: 18,
  courses: 1200,
  description: "Sweden is renowned for its progressive education system, sustainability leadership, and high-quality universities offering English-taught programs to international students.",
  features: [
    "Over 1,000 English-taught master's programs across various disciplines",
    "Strong emphasis on critical thinking, creativity, and group work",
    "Highly international classrooms with diverse student populations",
    "Free tuition for EU/EEA citizens; scholarships available for others",
    "Post-study work rights for up to 1 year after graduation",
    "High quality of life with a focus on sustainability and innovation"
  ],
  topUniversities: [
    "Lund University",
    "KTH Royal Institute of Technology",
    "Uppsala University",
    "Stockholm University",
    "Chalmers University of Technology",
    "University of Gothenburg"
  ],
  averageTuition: "$9,000 - $18,000 per year (for non-EU/EEA students)",
  applicationDeadlines: "Main intake: Mid-January (Autumn semester); results in April",
  visaRequirements: "Swedish Residence Permit for Studies with proof of admission, funds, and insurance"
},
{
  id: "france",
  name: "France",
  image: "images/france.jpg",
  universities: 35,
  courses: 2200,
  description: "France is one of Europe’s most popular study destinations, offering prestigious institutions, affordable education, and a rich cultural experience for international students.",
  features: [
    "Globally ranked universities and Grandes Écoles offering top-tier programs",
    "Low tuition fees at public universities even for international students",
    "Over 1,500 programs taught in English, especially at master’s level",
    "Post-study work rights and pathways to long-term residence",
    "Central European location with access to major cities and industries",
    "Rich cultural, culinary, and artistic heritage with strong student support systems"
  ],
  topUniversities: [
    "Sorbonne University",
    "École Polytechnique",
    "Sciences Po",
    "University of Paris-Saclay",
    "Grenoble Alpes University",
    "Université PSL (Paris Sciences et Lettres)"
  ],
  averageTuition: "$3,000 - $15,000 per year (public); higher for private institutions",
  applicationDeadlines: "Campus France application: November–March (varies by program)",
  visaRequirements: "Long-Stay Student Visa (VLS-TS) with proof of admission, financial means, and accommodation"
},
{
  id: "netherlands",
  name: "Netherlands",
  image: "images/netherlands.jpg",
  universities: 28,
  courses: 1900,
  description: "The Netherlands is a top choice for international students due to its high-quality education, affordable tuition, and a wide range of English-taught programs.",
  features: [
    "Over 2,000 English-taught bachelor's and master's programs",
    "Innovative teaching methods that emphasize independence and group work",
    "Strong industry links, especially in engineering, business, and design",
    "Affordable tuition and cost of living compared to other Western countries",
    "Excellent public transport and high standard of living",
    "One-year post-study work visa with opportunities to transition to residence"
  ],
  topUniversities: [
    "Delft University of Technology",
    "University of Amsterdam",
    "Leiden University",
    "Eindhoven University of Technology",
    "Utrecht University",
    "Erasmus University Rotterdam"
  ],
  averageTuition: "$8,000 - $20,000 per year (for non-EU/EEA students)",
  applicationDeadlines: "Typically January to May for September intake; some programs have earlier deadlines",
  visaRequirements: "MVV (Entry Visa) and Residence Permit arranged through the university with proof of funds and admission"
},
{
  id: "switzerland",
  name: "Switzerland",
  image: "images/switzerland.jpg",
  universities: 12,
  courses: 800,
  description: "Switzerland is globally recognized for its academic excellence, cutting-edge research, and multilingual education system set in a stunning alpine environment.",
  features: [
    "Home to some of the world's top-ranked universities and research institutes",
    "Multilingual country offering programs in English, French, German, and Italian",
    "Highly international student body and strong industry collaboration",
    "Focus on innovation, particularly in science, engineering, and finance",
    "Excellent quality of life and safety standards",
    "Post-study work opportunities and pathways to permanent residence"
  ],
  topUniversities: [
    "ETH Zurich – Swiss Federal Institute of Technology",
    "École Polytechnique Fédérale de Lausanne (EPFL)",
    "University of Zurich",
    "University of Geneva",
    "University of Bern",
    "University of Lausanne"
  ],
  averageTuition: "$1,500 - $4,000 per year (public universities)",
  applicationDeadlines: "Usually between December and April for Fall intake; varies by institution",
  visaRequirements: "Swiss Student Visa (D-Visa) with proof of admission, accommodation, and financial means"
},
{
  id: "norway",
  name: "Norway",
  image: "images/norway.jpg",
  universities: 15,
  courses: 900,
  description: "Norway is a highly attractive destination for international students, offering tuition-free education at public universities and a strong emphasis on equality, innovation, and sustainability.",
  features: [
    "No tuition fees for international students at public universities",
    "High academic standards with modern teaching and research facilities",
    "Wide range of English-taught master’s and some bachelor’s programs",
    "Strong focus on sustainability, energy, and Arctic research",
    "Safe and inclusive society with excellent quality of life",
    "Post-study job seeker visa for one year after graduation"
  ],
  topUniversities: [
    "University of Oslo",
    "Norwegian University of Science and Technology (NTNU)",
    "University of Bergen",
    "UiT The Arctic University of Norway",
    "Norwegian School of Economics (NHH)",
    "BI Norwegian Business School"
  ],
  averageTuition: "Free at public universities (students pay semester fee ~$100)",
  applicationDeadlines: "December 1 – March 1 (varies slightly by institution and nationality)",
  visaRequirements: "Norwegian Study Permit with proof of admission, accommodation, and financial means (~$13,000/year)"
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
                Global Education Solutions
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Explore Top Study Abroad Destinations
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                Discover the perfect country for your international education journey with our comprehensive guide to top study destinations.
              </p>
              <p className="text-gray-600 text-lg">
                At Edenz Consultant, we provide extensive support for students aspiring to study in any country worldwide. Our expertise extends beyond the featured destinations below to include consultancy services for over 30 countries globally.
              </p>
            </div>
          </div>
        </section>

        {/* Global Coverage Banner */}
        <section className="py-6 bg-primary/10 mb-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3">
              <Globe className="text-primary h-6 w-6" />
              <p className="text-gray-700 font-medium">
                We provide education consultancy services for students aspiring to study anywhere in the world. 
                <span className="hidden md:inline"> Contact us about any country not listed here.</span>
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
