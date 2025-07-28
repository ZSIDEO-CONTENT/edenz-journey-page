
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const destinations = [
  {
    id: 1,
    name: 'United States',
    image: 'images/us.jpg',
    courses: 5000
  },
  {
    id: 2,
    name: 'United Kingdom',
    image: 'images/uk.jpg',
    universities: 150,
    courses: 4000
  },
  {
    id: 3,
    name: 'Australia',
    image: 'images/australia.jpg',
    universities: 40,
    courses: 3000
  },
  {
    id: 4,
    name: 'Canada',
    image: 'images/canada.jpg',
    universities: 30,
    courses: 2500
  },
  {
    id: 5,
    name: 'Germany',
    image: 'images/germany.jpg',
    universities: 45,
    courses: 2800
  },
  {
    id: 6,
    name: 'New Zealand',
    image: 'images/newzealand.jpg',
    universities: 25,
    courses: 1800
  },
  {
    id: 7,
    name: 'Ireland',
    image: 'images/ireland.jpg',
    universities: 22,
    courses: 1500
  },
  {
    id: 8,
    name: 'Sweden',
    image: 'images/sweden.jpg',
    universities: 18,
    courses: 1200
  },
  {
    id: 9,
    name: 'France',
    image: 'images/france.jpg',
    universities: 35,
    courses: 2200
  },
  {
    id: 10,
    name: 'Netherlands',
    image: 'images/netherlands.jpg',
    universities: 28,
    courses: 1900
  },
  {
    id: 11,
    name: 'Switzerland',
    image: 'images/switzerland.jpg',
    universities: 12,
    courses: 800
  },
  {
    id: 12,
    name: 'Norway',
    image: 'images/norway.jpg',
    universities: 15,
    courses: 900
  }
];

const Destinations = () => {
  const [showAll, setShowAll] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleDestinations = showAll ? destinations : destinations.slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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
          {visibleDestinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className="destination-card group animate-slide-up transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-64 relative overflow-hidden rounded-t-2xl">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl text-white font-bold mb-1">{destination.name}</h3>
                  <div className="flex items-center text-white/80 text-sm space-x-3">
                    {destination.universities && <span>{destination.universities} Universities</span>}
                    <span>•</span>
                    <span>{destination.courses}+ Courses</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-b-2xl">
                <Link to="/countries" onClick={scrollToTop}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                    Explore Options
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowAll(prev => !prev)} 
            className="text-primary underline text-sm"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </Button>

          <Link to="/countries" onClick={scrollToTop}>
            <Button className="btn-primary px-8 py-3 text-lg">
              View All Destinations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
