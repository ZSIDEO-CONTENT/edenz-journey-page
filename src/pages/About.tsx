
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users, Award, GraduationCap, Building, Star, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="hero-blob h-[600px] w-[600px] right-[-300px] top-[-100px] opacity-30"></div>
          <div className="hero-blob h-[600px] w-[600px] left-[-300px] bottom-[-100px] opacity-30 animation-delay-2000"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                About Us
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Trusted Study Abroad Partner in Pakistan
              </h1>
              <p className="text-gray-600 text-lg">
                Edenz Consultant has been helping Pakistani students achieve their global education dreams since 2003. With our expert guidance and personalized approach, we've successfully placed thousands of students in prestigious universities worldwide.
              </p>
            </div>
            
            <div className="relative mt-12 md:mt-16">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                alt="Edenz Consultant Team" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-edenz-light/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                  Our Story
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  From Lahore to the World
                </h2>
                <p className="text-gray-600 mb-6">
                  Founded in 2003 in Lahore, Pakistan, Edenz Consultant began with a mission to help Pakistani students access quality education abroad. What started as a small team with big ambitions has now grown into one of Pakistan's most trusted education consultancies.
                </p>
                <p className="text-gray-600 mb-6">
                  We understand the unique challenges Pakistani students face when applying to international universities, from academic requirements to visa processes. Our specialized knowledge and experience have helped thousands of students overcome these challenges.
                </p>
                <p className="text-gray-600">
                  Beyond admissions, we take pride in our comprehensive test preparation programs for IELTS, PTE, TOEFL, GRE, and GMAT, helping students build the skills they need to succeed in international academics.
                </p>
              </div>
              
              <div className="relative h-[500px] animate-fade-in">
                <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-lg z-20">
                  <img 
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1484&q=80" 
                    alt="Edenz Team Meeting" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-lg z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Edenz Office" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
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
        </section>

        {/* Team Section */}
        <section className="py-20 bg-edenz-light/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Meet Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Dedicated Education Experts
              </h2>
              <p className="text-gray-600 text-lg">
                Our team consists of experienced education consultants, many of whom have studied abroad themselves and understand the journey firsthand.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Ahmed Khan",
                  position: "Founder & CEO",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                },
                {
                  name: "Fatima Rizvi",
                  position: "Head Counselor",
                  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                },
                {
                  name: "Zain Malik",
                  position: "Visa Specialist",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                },
                {
                  name: "Ayesha Ahmed",
                  position: "IELTS Instructor",
                  image: "https://images.unsplash.com/photo-1619422586083-facf9e26e672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80"
                }
              ].map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="h-64 relative">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-gray-600">{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
