
import { 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Award, 
  Compass, 
  Users, 
  Plane, 
  MapPin 
} from 'lucide-react';

const features = [
  {
    icon: <GraduationCap />,
    title: 'University Admissions',
    description: 'Get expert guidance to secure admission in top-ranked universities worldwide.'
  },
  {
    icon: <BookOpen />,
    title: 'Course Selection',
    description: 'Find the perfect course aligned with your academic background and career goals.'
  },
  {
    icon: <Globe />,
    title: 'Country Selection',
    description: 'Choose the ideal study destination based on your preferences and requirements.'
  },
  {
    icon: <Award />,
    title: 'Scholarship Guidance',
    description: 'Discover scholarship opportunities to fund your international education.'
  },
  {
    icon: <Plane />,
    title: 'Visa Assistance',
    description: 'Complete support for student visa application with our high success rate.'
  },
  {
    icon: <Users />,
    title: 'Pre-Departure Briefing',
    description: 'Comprehensive orientation to prepare you for your study abroad journey.'
  },
  {
    icon: <MapPin />,
    title: 'Accommodation',
    description: 'Assistance in finding suitable and affordable accommodation options.'
  },
  {
    icon: <Compass />,
    title: 'Career Counseling',
    description: 'Professional guidance to align your education with your career aspirations.'
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-edenz-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comprehensive Study Abroad Services
          </h2>
          <p className="text-gray-600 text-lg">
            Edenz Consultant offers end-to-end support for your international education journey, 
            from university selection to post-arrival assistance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary/10 text-primary rounded-xl p-3 inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
