
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-primary font-bold text-2xl">Edenz</span>
              <span className="text-foreground font-medium">Consultant</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="nav-link">Home</a>
            <div className="relative group">
              <button className="nav-link flex items-center">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 transform origin-top-left">
                <a href="#" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md">Study Abroad Counseling</a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md">Visa Assistance</a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md">University Applications</a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md">Test Preparation</a>
              </div>
            </div>
            <a href="#" className="nav-link">Destinations</a>
            <a href="#" className="nav-link">About Us</a>
            <a href="#" className="nav-link">Success Stories</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>

          <div className="hidden md:block">
            <Button className="btn-primary">Book Consultation</Button>
          </div>

          <button onClick={toggleMobileMenu} className="md:hidden text-gray-700">
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 invisible'
      } overflow-hidden`}>
        <div className="container mx-auto px-4 py-3 space-y-3">
          <a href="#" className="block py-2 px-4 hover:bg-edenz-light rounded-md">Home</a>
          <a href="#" className="block py-2 px-4 hover:bg-edenz-light rounded-md">Services</a>
          <a href="#" className="block py-2 px-4 hover:bg-edenz-light rounded-md">Destinations</a>
          <a href="#" className="block py-2 px-4 hover:bg-edenz-light rounded-md">About Us</a>
          <a href="#" className="block py-2 px-4 hover:bg-edenz-light rounded-md">Success Stories</a>
          <a href="#" className="block py-2 px-4 hover:bg-edenz-light rounded-md">Contact</a>
          <div className="pt-2 pb-4">
            <Button className="btn-primary w-full">Book Consultation</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
