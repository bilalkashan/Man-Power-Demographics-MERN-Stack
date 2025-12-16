import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, ChevronDown, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [mobileIntroOpen, setMobileIntroOpen] = useState(false); 
  const location = useLocation();

  // Helper to check active link
  const isActive = (path) => location.pathname === path ? "text-accent font-bold" : "text-gray-600 hover:text-accent";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20"> 
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary font-bold text-2xl">
              <Users className="w-8 h-8 mr-2 text-accent" />
              My HR
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={`${isActive('/')} transition`}>Home</Link>

            {/* Introduction Dropdown (Hover Group) */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center text-gray-600 group-hover:text-accent transition focus:outline-none">
                Introduction <ChevronDown className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Dropdown Content */}
              <div className="absolute top-full left-0 w-60 bg-white border-t-2 border-accent shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <DropdownLink to="/about">About Us</DropdownLink>
                  <DropdownLink to="/our-team">Our Team</DropdownLink>
                </div>
              </div>
            </div>

            <Link to="/services" className={`${isActive('/services')} transition`}>Solutions/Services</Link>
            <Link to="/clients" className={`${isActive('/clients')} transition`}>Clients</Link>
            <Link to="/news" className={`${isActive('/news')} transition`}>News/Events</Link>
            <Link to="/careers" className={`${isActive('/careers')} transition`}>Careers</Link>
            {/* <Link to="#" className={`${isActive('/careers')} transition`}>Careers</Link> */}
            {/* <Link to="/login" className={`${isActive('/login')} transition`}>Login</Link>
            <Link to="/signup" className={`${isActive('/signup')} transition`}>Signup</Link> */}
            
            {/* Contact Button */}
            <Link to="/contact" className="ml-4 px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Get In Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none p-2">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto shadow-inner">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <MobileLink to="/" onClick={() => setIsOpen(false)}>Home</MobileLink>

            <div>
              <button 
                onClick={() => setMobileIntroOpen(!mobileIntroOpen)}
                className="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                <span>Introduction</span>
                <ChevronRight className={`w-5 h-5 transition-transform ${mobileIntroOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {/* Mobile Sub-menu */}
              {mobileIntroOpen && (
                <div className="pl-6 space-y-1 bg-gray-50 rounded-lg mb-2 py-2">
                   <MobileSubLink to="/about" onClick={() => setIsOpen(false)}>About Us</MobileSubLink>
                   <MobileSubLink to="/our-team" onClick={() => setIsOpen(false)}>Our Team</MobileSubLink>
                </div>
              )}
            </div>

            <MobileLink to="/services" onClick={() => setIsOpen(false)}>Solutions/Services</MobileLink>
            <MobileLink to="/clients" onClick={() => setIsOpen(false)}>Clients</MobileLink>
            <MobileLink to="/news" onClick={() => setIsOpen(false)}>News/Events</MobileLink>
            {/* <MobileLink to="/careers" onClick={() => setIsOpen(false)}>Careers</MobileLink> */}
            
            <div>
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-accent text-white rounded-lg font-bold shadow-md active:bg-blue-600"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper Components for clean code
const DropdownLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="block px-6 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent hover:pl-8 transition-all duration-200 border-l-4 border-transparent hover:border-accent"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-accent rounded-lg transition"
  >
    {children}
  </Link>
);

const MobileSubLink = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="block px-4 py-2 text-sm text-gray-500 hover:text-accent transition"
  >
    • {children}
  </Link>
);

export default Navbar;