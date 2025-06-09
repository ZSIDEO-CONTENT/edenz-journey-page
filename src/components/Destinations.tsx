
import { Link } from 'react-router-dom';
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
  {
    id: 5,
    name: 'Germany',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
    universities: 45,
    courses: 2800
  },
  {
    id: 6,
    name: 'New Zealand',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
    universities: 25,
    courses: 1800
  },
  {
    id: 7,
    name: 'Ireland',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144',
    universities: 22,
    courses: 1500
  },
  {
    id: 8,
    name: 'Sweden',
    image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11',
    universities: 18,
    courses: 1200
  },
  {
    id: 9,
    name: 'France',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52',
    universities: 35,
    courses: 2200
  },
  {
    id: 10,
    name: 'Netherlands',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017',
    universities: 28,
    courses: 1900
  },
  {
    id: 11,
    name: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    universities: 12,
    courses: 800
  },
  {
    id: 12,
    name: 'Norway',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    universities: 15,
    courses: 900
  }
];

const Destinations = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Global Education Solutions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Top Study Abroad Destinations
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            Explore popular countries for international education with world-class universities and diverse courses.
          </p>
          <p className="text-gray-600 text-lg">
            At Edenz Consultant, we provide comprehensive education consultancy services for students aspiring to study anywhere in the world. Beyond the destinations shown below, we assist with admissions to universities in over 30 countries globally.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className="destination-card group animate-slide-up"
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
                <Link to="/countries" onClick={scrollToTop}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                    Explore
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/countries" onClick={scrollToTop}>
            <Button className="btn-primary">
              View All Destinations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
