
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
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
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <p className="mb-6">We collect information you provide directly to us, such as when you create an account, make a consultation booking, or contact us for support.</p>
                
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="mb-6">We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                
                <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                <p className="mb-6">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="mb-6">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at info@edenzconsultant.org</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
