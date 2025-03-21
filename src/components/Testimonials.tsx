
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Master\'s in Business Analytics, Harvard University',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964',
    content: 'Edenz Consultant was instrumental in my journey to Harvard. Their personalized guidance and attention to detail made the complex application process smooth and successful. I couldn\'t be more grateful!'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Computer Science, University of Toronto',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974',
    content: 'Thanks to Edenz Consultant, my dream of studying in Canada became a reality. Their expert visa guidance and university selection advice were invaluable. Highly recommend their professional services!'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    title: 'PhD in Biotechnology, University of Melbourne',
    image: 'https://images.unsplash.com/photo-1611432579699-484f7990b127?q=80&w=1770',
    content: 'The team at Edenz Consultant went above and beyond to help me secure a scholarship for my PhD program. Their expertise and commitment to student success is truly exceptional.'
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex < testimonials.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <section className="py-20 bg-edenz-light/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Our Students Say
          </h2>
          <p className="text-gray-600 text-lg">
            Hear from students who successfully achieved their study abroad dreams with Edenz Consultant.
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-10 flex-col lg:flex-row">
            <div className="lg:w-2/5">
              <div className="relative animate-fade-in">
                <div className="bg-primary/10 rounded-full h-96 w-96 absolute -left-10 -top-10 animate-blob opacity-40"></div>
                <div className="relative z-10 overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name} 
                    className="w-full h-[400px] object-cover transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/5 relative animate-slide-right">
              <Quote className="text-primary/10 w-24 h-24 absolute -left-12 -top-12" />
              
              <div className="bg-white rounded-2xl p-8 shadow-lg relative">
                <p className="text-xl leading-relaxed mb-6">
                  {testimonials[activeIndex].content}
                </p>
                
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-bold text-lg">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[activeIndex].title}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={handleNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
