
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-2 md:py-3' : 'bg-transparent py-3 md:py-5'
        }`}
    >
      <div className="container mx-auto px-2 md:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={scrollToTop}>
              <img
                src="/edenz-logo.webp"
                alt="Edenz Consultants"
                className="h-8 md:h-10 w-auto mr-2"
              />
              <div className="hidden sm:block">
                <span className="text-primary font-bold mr-1">Edenz</span>
                <span className="text-foreground font-bold">Consultant</span>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="nav-link text-sm xl:text-base" onClick={scrollToTop}>Home</Link>
            <div className="relative group">
              <button className="nav-link flex items-center text-sm xl:text-base">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-[480px] rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 transform origin-top-left grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Core Services</h4>
                  <Link to="/services" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>Study Abroad Counseling</Link>
                  <Link to="/services" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>Visa Assistance</Link>
                  <Link to="/services" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>University Applications</Link>
                </div>
                <div className="col-span-1 border-l border-gray-100 pl-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Test Prep</h4>
                  <Link to="/services/ielts" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>IELTS Preparation</Link>
                  <Link to="/services/pte" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>PTE Preparation</Link>
                  <Link to="/services/toefl" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>TOEFL Preparation</Link>
                  <Link to="/services/gre" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>GRE Preparation</Link>
                  <Link to="/services/gmat" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md text-gray-700 hover:text-primary transition-colors" onClick={scrollToTop}>GMAT Preparation</Link>
                </div>
              </div>
            </div>
            <Link to="/countries" className="nav-link text-sm xl:text-base" onClick={scrollToTop}>Destinations</Link>
            <Link to="/about" className="nav-link text-sm xl:text-base" onClick={scrollToTop}>About Us</Link>
            <Link to="/contact" className="nav-link text-sm xl:text-base" onClick={scrollToTop}>Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">


            <Link to="/contact" onClick={scrollToTop}>
              <Button className="btn-primary text-xs xl:text-sm px-3 xl:px-4">
                <span className="hidden xl:inline">Contact Us</span>
                <span className="xl:hidden">Contact</span>
              </Button>
            </Link>
          </div>

          <button onClick={toggleMobileMenu} className="lg:hidden text-gray-700 p-2">
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className={`lg:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 invisible'
        } overflow-hidden`}>
        <div className="container mx-auto px-4 py-3 space-y-3">
          <Link to="/" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Home</Link>
          <div className="border-b border-gray-100 pb-2 mb-2">
            <Link to="/services" className="block py-2 px-4 hover:bg-edenz-light rounded-md font-medium text-primary" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>All Services</Link>
            <div className="pl-4 space-y-1 mt-1">
              <Link to="/services/ielts" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>IELTS</Link>
              <Link to="/services/pte" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>PTE</Link>
              <Link to="/services/toefl" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>TOEFL</Link>
              <Link to="/services/gre" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>GRE</Link>
              <Link to="/services/gmat" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>GMAT</Link>
            </div>
          </div>
          <Link to="/countries" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Destinations</Link>
          <Link to="/about" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>About Us</Link>
          <Link to="/contact" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Contact</Link>



          <div className="pt-2 pb-4">
            <Link to="/contact" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>
              <Button className="btn-primary w-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
