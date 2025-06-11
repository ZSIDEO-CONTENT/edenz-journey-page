
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-primary font-medium mr-1">Edenz</span>
              <span className="font-medium">Consultant</span>
            </div>
            <p className="text-gray-400 mb-6 text-left">
              Pakistan's leading study abroad consultancy helping students achieve their global education dreams with personalized guidance, visa processing, and test preparation.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/edenzconsultant" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-primary transition-colors p-2 rounded-full">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/edenzconsultant" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-primary transition-colors p-2 rounded-full">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6 text-left">Services</h3>
            <ul className="space-y-3 text-left">
              <li><Link to="/services" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">University Admissions</Link></li>
              <li><Link to="/services" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">Visa Assistance</Link></li>
              <li><Link to="/services" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">IELTS Preparation</Link></li>
              <li><Link to="/services" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">PTE/TOEFL Training</Link></li>
              <li><Link to="/services" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">GRE/GMAT Coaching</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6 text-left">Destinations</h3>
            <ul className="space-y-3 text-left">
              <li><Link to="/countries" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">United States</Link></li>
              <li><Link to="/countries" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">United Kingdom</Link></li>
              <li><Link to="/countries" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">Australia</Link></li>
              <li><Link to="/countries" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">Canada</Link></li>
              <li><Link to="/countries" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">Germany</Link></li>
              <li><Link to="/countries" onClick={scrollToTop} className="text-gray-400 hover:text-primary transition-colors">New Zealand</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6 text-left">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <a 
                    href="https://maps.app.goo.gl/dw35KH1WUHoX6aPP7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    627 B Iqbal Avenua, Khayban e jinnah road, near UCP University,  Johar Town, Lahore 54000, Pakistan.
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <a href="tel:+923334229697" className="text-gray-400 hover:text-primary transition-colors">+92 333 4228697</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <a href="mailto:info@edenzconsultant.org" className="text-gray-400 hover:text-primary transition-colors">info@edenzconsultant.org</a>
                <br />
                <a href="mailto:info@edenzconsultant.org" className="text-gray-400 hover:text-primary transition-colors">taimoor@edenzconsultant.org</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Edenz Consultant. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/privacy-policy" onClick={scrollToTop} className="text-gray-500 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" onClick={scrollToTop} className="text-gray-500 hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/cookies-policy" onClick={scrollToTop} className="text-gray-500 hover:text-primary transition-colors">Cookies Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
