
import { Button } from '@/components/ui/button';
import { GraduationCap, Globe, BookOpen, Users, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Decorative blobs with enhanced animations */}
      <div className="hero-blob h-[500px] w-[500px] right-[-200px] top-[-100px] opacity-70 animate-blob-slow"></div>
      <div className="hero-blob h-[600px] w-[600px] left-[-300px] bottom-[-200px] opacity-50 animate-blob-slow animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 md:pr-10 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <span className="animate-pulse-slow mr-2">●</span> Pakistan's Premier Education Consultancy
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 animate-pulse-slow">Your Global Education</span> Journey Begins Here
            </h1>
            
            <p className="text-lg text-gray-600 md:pr-10">
              Edenz Consultant is Pakistan's leading study abroad consultancy, helping students with university admissions, visa processing, and test preparation for IELTS, PTE, TOEFL, GRE, GMAT and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/chat">
                <Button size="lg" className="btn-primary group">
                  <MessageSquare className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:animate-bounce" />
                  Chat with Edenz AI
                  <Sparkles className="ml-2 h-4 w-4 text-yellow-300 animate-pulse-slow" />
                </Button>
              </Link>
              <Link to="/countries">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                  Explore Destinations
                </Button>
              </Link>
            </div>
            

          </div>
          
          <div className="relative animate-fade-in animation-delay-300">
            {/* Main image with lower z-index */}
            <div className="relative z-0 rounded-3xl overflow-hidden shadow-2xl animate-slide-left hover:scale-105 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070" 
                alt="Students studying abroad" 
                className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 transition-opacity duration-300 hover:opacity-90">
                <div className="text-white mb-4 transform transition-transform duration-300 hover:translate-y-[-5px]">
                  <h3 className="text-2xl font-bold">Study Abroad Success</h3>
                  <p className="text-white/80">Achieve your academic and career goals</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements with higher z-index and improved animations */}
            <div className="absolute top-10 -left-14 glass-card rounded-2xl p-4 shadow-lg animate-float-slow z-10 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-edenz-green/10 rounded-full p-2">
                  <GraduationCap className="h-6 w-6 text-primary animate-spin-very-slow" />
                </div>
                <div>
                  <p className="font-medium">100%</p>
                  <p className="text-sm text-gray-500">Visa Success Rate</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-20 -right-10 glass-card rounded-2xl p-4 shadow-lg animate-float-slow animation-delay-1000 z-10 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-edenz-green/10 rounded-full p-2">
                  <Globe className="h-6 w-6 text-primary animate-spin-very-slow" />
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
