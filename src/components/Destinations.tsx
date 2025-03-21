
import { Button } from '@/components/ui/button';

const destinations = [
  {
    id: 1,
    name: 'United States',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    universities: 200,
    courses: 5000
  },
  {
    id: 2,
    name: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    universities: 150,
    courses: 4000
  },
  {
    id: 3,
    name: 'Australia',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
    universities: 40,
    courses: 3000
  },
  {
    id: 4,
    name: 'Canada',
    image: 'https://images.unsplash.com/photo-1569681157442-5cd435fbcd65',
    universities: 30,
    courses: 2500
  },
];

const Destinations = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Study Destinations
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Top Study Abroad Destinations
          </h2>
          <p className="text-gray-600 text-lg">
            Explore popular countries for international education with world-class universities and diverse courses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className="destination-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl text-white font-bold mb-1">{destination.name}</h3>
                  <div className="flex items-center text-white/80 text-sm space-x-3">
                    <span>{destination.universities} Universities</span>
                    <span>•</span>
                    <span>{destination.courses}+ Courses</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                  Explore
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="btn-primary">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
