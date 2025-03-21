
import { Button } from '@/components/ui/button';
import { GraduationCap, Globe, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Decorative blobs */}
      <div className="hero-blob h-[500px] w-[500px] right-[-200px] top-[-100px] opacity-70"></div>
      <div className="hero-blob h-[600px] w-[600px] left-[-300px] bottom-[-200px] opacity-50 animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 md:pr-10 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <span className="animate-pulse mr-2">●</span> Pakistan's Premier Education Consultancy
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Your Global Education Journey Begins Here
            </h1>
            
            <p className="text-lg text-gray-600 md:pr-10">
              Edenz Consultant is Pakistan's leading study abroad consultancy, helping students with university admissions, visa processing, and test preparation for IELTS, PTE, TOEFL, GRE, GMAT and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/book-consultation">
                <Button size="lg" className="btn-primary">
                  Free Consultation
                </Button>
              </Link>
              <Link to="/countries">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Explore Destinations
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center pt-5 text-gray-600">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-medium">{i}</span>
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="font-medium">1000+ Students</p>
                <p className="text-sm">Trusted us for their study abroad journey</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in animation-delay-300">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl animate-slide-left">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070" 
                alt="Students studying abroad" 
                className="w-full h-[500px] object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                <div className="text-white mb-4">
                  <h3 className="text-2xl font-bold">Study Abroad Success</h3>
                  <p className="text-white/80">Achieve your academic and career goals</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-10 -left-14 glass-card rounded-2xl p-4 shadow-lg animate-float">
              <div className="flex items-center gap-3">
                <div className="bg-edenz-green/10 rounded-full p-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">100%</p>
                  <p className="text-sm text-gray-500">Visa Success Rate</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-20 -right-10 glass-card rounded-2xl p-4 shadow-lg animate-float animation-delay-1000">
              <div className="flex items-center gap-3">
                <div className="bg-edenz-green/10 rounded-full p-2">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">50+ Countries</p>
                  <p className="text-sm text-gray-500">Study Destinations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
