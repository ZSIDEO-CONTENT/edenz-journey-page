
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-2 md:py-3' : 'bg-transparent py-3 md:py-5'
      }`}
    >
      <div className="container mx-auto px-2 md:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={scrollToTop}>
              <img 
                src="/edenz-logo.webp" 
                alt="Edenz Consultants Logo" 
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
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 transform origin-top-left">
                <Link to="/services" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md" onClick={scrollToTop}>Study Abroad Counseling</Link>
                <Link to="/services" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md" onClick={scrollToTop}>Visa Assistance</Link>
                <Link to="/services" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md" onClick={scrollToTop}>University Applications</Link>
                <Link to="/services" className="block px-4 py-2 text-sm hover:bg-edenz-light rounded-md" onClick={scrollToTop}>Test Preparation</Link>
              </div>
            </div>
            <Link to="/countries" className="nav-link text-sm xl:text-base" onClick={scrollToTop}>Destinations</Link>
            <Link to="/about" className="nav-link text-sm xl:text-base" onClick={scrollToTop}>About Us</Link>
            <Link to="/contact" className="nav-link text-sm xl:text-base" onClick={scrollToTop}>Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs xl:text-sm">
                  <User className="h-4 w-4" />
                  <span className="hidden xl:inline">Student Portal</span>
                  <span className="xl:hidden">Portal</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-md">
                <DropdownMenuItem asChild>
                  <Link to="/student/login" className="cursor-pointer" onClick={scrollToTop}>Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student/register" className="cursor-pointer" onClick={scrollToTop}>Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/book-consultation" onClick={scrollToTop}>
              <Button className="btn-primary text-xs xl:text-sm px-3 xl:px-4">
                <span className="hidden xl:inline">Book Consultation</span>
                <span className="xl:hidden">Book</span>
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

      <div className={`lg:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 invisible'
      } overflow-hidden`}>
        <div className="container mx-auto px-4 py-3 space-y-3">
          <Link to="/" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Home</Link>
          <Link to="/services" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Services</Link>
          <Link to="/countries" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Destinations</Link>
          <Link to="/about" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>About Us</Link>
          <Link to="/contact" className="block py-2 px-4 hover:bg-edenz-light rounded-md" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Contact</Link>
          
          <div className="border-t border-gray-100 pt-2">
            <h3 className="px-4 py-2 text-sm font-medium text-gray-600">Student Portal</h3>
            <Link to="/student/login" className="block py-2 px-6 hover:bg-edenz-light rounded-md text-primary" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Login</Link>
            <Link to="/student/register" className="block py-2 px-6 hover:bg-edenz-light rounded-md text-primary" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>Register</Link>
          </div>
          
          <div className="pt-2 pb-4">
            <Link to="/book-consultation" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>
              <Button className="btn-primary w-full">Book Consultation</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
