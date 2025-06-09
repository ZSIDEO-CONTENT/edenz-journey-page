
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <main>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
                <p className="mb-6">By accessing and using Edenz Consultant services, you accept and agree to be bound by the terms and provision of this agreement.</p>
                
                <h2 className="text-2xl font-bold mb-4">Services Description</h2>
                <p className="mb-6">Edenz Consultant provides educational consultation services for students seeking to study abroad, including university admissions guidance, visa assistance, and test preparation.</p>
                
                <h2 className="text-2xl font-bold mb-4">User Obligations</h2>
                <p className="mb-6">Users must provide accurate information and comply with all applicable laws and regulations when using our services.</p>
                
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="mb-6">Edenz Consultant shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
                
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p>For questions about these Terms of Service, contact us at info@edenzconsultant.org</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
