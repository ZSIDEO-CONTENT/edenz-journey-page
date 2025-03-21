
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-primary font-bold text-2xl mr-1">Edenz</span>
              <span className="font-medium">Consultant</span>
            </div>
            <p className="text-gray-400 mb-6">
              Pakistan's leading study abroad consultancy helping students achieve their global education dreams with personalized guidance, visa processing, and test preparation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-primary transition-colors p-2 rounded-full">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary transition-colors p-2 rounded-full">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary transition-colors p-2 rounded-full">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary transition-colors p-2 rounded-full">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">University Admissions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Visa Assistance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">IELTS Preparation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">PTE/TOEFL Training</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">GRE/GMAT Coaching</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Destinations</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">United States</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">United Kingdom</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Australia</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Canada</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Germany</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">New Zealand</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Education Street, Gulberg III, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-400">+92 42 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-400">contact@edenzconsultant.org</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Edenz Consultant. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Cookies Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
