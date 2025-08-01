
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users, Award, GraduationCap } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        {/* CEO Section */}
        <section className="pt-32 pb-20 w-full">
          <div className="w-full px-4">
            <div className="w-full max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                  Leadership
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Meet Our CEO
                </h1>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Leading Edenz Consultant with vision, expertise, and a commitment to student success in international education.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-96 lg:h-auto">
                    <img 
                      src="/lovable-uploads/ddb0bc44-b0f9-47fb-b0be-f26b900dea36.png" 
                      alt="Dr. Taimoor Ali Ahmad - CEO" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden"></div>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-2">Dr. Taimoor Ali Ahmad</h2>
                    <p className="text-primary font-semibold text-lg mb-6">Founder & CEO</p>
                    
                    <div className="space-y-4 text-gray-600">
                      <p>
                        Dr. Taimoor Ali Ahmad is the visionary founder and CEO of Edenz Consultant, with over two decades of experience in international education consulting. His passion for helping Pakistani students achieve their global education dreams has been the driving force behind Edenz Consultant's success.
                      </p>
                      
                      <p>
                        Under his leadership, Edenz Consultant has successfully guided thousands of students to prestigious universities across the globe. Dr. Ahmad's deep understanding of international education systems and visa processes has made him a trusted advisor for students and parents alike.
                      </p>
                      
                      <p>
                        His commitment to excellence and student-first approach continues to shape Edenz Consultant's mission of making quality international education accessible to Pakistani students.
                      </p>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">20+</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">5000+</div>
                        <div className="text-sm text-gray-600">Students Guided</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-edenz-light/30 w-full">
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                  Our Values
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  What Drives Us Every Day
                </h2>
                <p className="text-gray-600 text-lg">
                  At Edenz Consultant, our core values guide every interaction and decision we make while helping students navigate their international education journey.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
                  <div className="bg-primary/10 text-primary rounded-xl p-3 inline-block mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Student-First Approach</h3>
                  <p className="text-gray-600">
                    We prioritize your goals and aspirations, tailoring our guidance to your unique academic background and career plans.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '150ms' }}>
                  <div className="bg-primary/10 text-primary rounded-xl p-3 inline-block mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Excellence & Integrity</h3>
                  <p className="text-gray-600">
                    We uphold the highest standards of professionalism and ethical conduct in all our operations and student interactions.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="bg-primary/10 text-primary rounded-xl p-3 inline-block mb-4">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Continuous Learning</h3>
                  <p className="text-gray-600">
                    We constantly update our knowledge about global education trends, university requirements, and visa regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
