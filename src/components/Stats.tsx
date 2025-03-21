
import { GraduationCap, Globe, Award, Users } from 'lucide-react';

const stats = [
  {
    id: 1,
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    value: '5000+',
    label: 'Students Placed',
    description: 'In top universities worldwide'
  },
  {
    id: 2,
    icon: <Globe className="h-8 w-8 text-primary" />,
    value: '50+',
    label: 'Countries',
    description: 'Global education destinations'
  },
  {
    id: 3,
    icon: <Award className="h-8 w-8 text-primary" />,
    value: '95%',
    label: 'Success Rate',
    description: 'For visa applications'
  },
  {
    id: 4,
    icon: <Users className="h-8 w-8 text-primary" />,
    value: '15+',
    label: 'Years Experience',
    description: 'In education consulting'
  }
];

const Stats = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.id}
              className="text-center p-8 rounded-2xl border border-edenz-light bg-white shadow-sm hover:shadow-md transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mx-auto bg-primary/10 rounded-full p-4 inline-flex mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-lg font-medium text-gray-800 mb-1">{stat.label}</p>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
