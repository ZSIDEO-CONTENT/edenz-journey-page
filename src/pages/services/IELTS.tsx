
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const IELTS = () => {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden bg-edenz-light/20">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-10">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Test Preparation
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-edenz-dark">
                IELTS Preparation
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Master the International English Language Testing System with our expert-led coaching and comprehensive study materials.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold mb-6">About IELTS</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  The International English Language Testing System (IELTS) is designed to help you work, study or migrate to a country where English is the native language. This includes Australia, Canada, New Zealand, the UK and USA.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your ability to listen, read, write and speak in English will be assessed during the test. IELTS is graded on a scale of 1-9.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Expert Instructors",
                    "Mock Tests",
                    "Study Material",
                    "Personalized Feedback"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1571260899304-42d989533221?q=80&w=2070"
                  alt="IELTS Preparation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Structure Section */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-20">
              <h2 className="text-3xl font-bold mb-10 text-center">IELTS Test Structure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "Listening",
                    duration: "30 Minutes",
                    description: "4 recordings of native English speakers."
                  },
                  {
                    title: "Reading",
                    duration: "60 Minutes",
                    description: "40 questions designed to test a wide range of reading skills."
                  },
                  {
                    title: "Writing",
                    duration: "60 Minutes",
                    description: "Two tasks: describing visual information and writing an essay."
                  },
                  {
                    title: "Speaking",
                    duration: "11-14 Minutes",
                    description: "Face-to-face interview including short questions and speaking at length."
                  }
                ].map((part, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary">
                      {idx === 0 ? <Users /> : idx === 1 ? <BookOpen /> : idx === 2 ? <CheckCircle2 /> : <Clock />}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{part.title}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{part.duration}</p>
                    <p className="text-gray-600 text-sm">{part.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-primary rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Preparation?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join our upcoming batch and get the score you need for your study abroad dreams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/test-prep-checkout?service=ielts">
                  <Button size="lg" className="w-full sm:w-auto font-bold bg-white text-primary hover:bg-gray-100">
                    Register for $250 Now
                  </Button>
                </Link>
                <a href="tel:+923334228697">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold border-white text-white hover:bg-white/10">
                    Call Now
                  </Button>
                </a>
                <a href="https://wa.me/923334228697" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                    WhatsApp Us
                  </Button>
                </a>
              </div>
              <p className="mt-8 text-sm text-white/70">
                Note: Standardized test preparation fees are non-refundable. <br />
                By taking our service you agree with our <Link to="/legal" className="underline hover:text-white">legal policies</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IELTS;
