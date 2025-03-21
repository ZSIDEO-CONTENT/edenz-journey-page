
import { Button } from '@/components/ui/button';
import { GraduationCap, Phone, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="hero-blob h-[600px] w-[600px] right-[-300px] top-[-100px] opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-primary rounded-3xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2">
            <div className="p-12 md:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Begin Your Global Education Journey?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Schedule a free consultation with our expert counselors to discuss your study abroad plans and get personalized guidance.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>+92 42 1234 5678</span>
                </div>
                <div className="flex items-center text-white">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>contact@edenzconsultant.org</span>
                </div>
              </div>
              
              <div className="mt-10">
                <Link to="/book-consultation">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg transition-all hover:-translate-y-1">
                    <Calendar className="h-5 w-5 mr-2" /> Book Consultation
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative h-full min-h-[300px] md:min-h-0">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071" 
                alt="Student studying abroad" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              
              <div className="absolute bottom-12 left-12 bg-white rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Free Consultation</p>
                    <p className="text-sm text-gray-500">No obligations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
