
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const CookiesPolicy = () => {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <main>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Link to="/">
                  <Button variant="outline" className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Cookies Policy</h1>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
                <p className="mb-6">Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to site owners.</p>
                
                <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
                <p className="mb-6">We use cookies to improve your browsing experience, analyze site traffic, and personalize content. We may also use cookies for authentication and to remember your preferences.</p>
                
                <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
                <ul className="mb-6">
                  <li>Essential cookies: Required for the website to function properly</li>
                  <li>Analytics cookies: Help us understand how visitors interact with our website</li>
                  <li>Preference cookies: Remember your settings and preferences</li>
                </ul>
                
                <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
                <p className="mb-6">You can control and manage cookies in your browser settings. Please note that disabling cookies may affect the functionality of our website.</p>
                
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p>If you have questions about our use of cookies, please contact us at info@edenzconsultant.org</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPolicy;
