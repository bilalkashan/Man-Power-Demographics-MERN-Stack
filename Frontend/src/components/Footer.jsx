import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center text-2xl font-bold">
              <Users className="w-8 h-8 mr-2 text-accent" />
              HR Portal
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering our organization through strategic talent management, 
              continuous development, and a commitment to employee well-being.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={<Linkedin size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Facebook size={20} />} />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Our Services</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Employees</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Employee Handbook</a></li>
              <li><a href="#" className="hover:text-white transition">Leave Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Payroll Schedule</a></li>
              <li><a href="#" className="hover:text-white transition">Report an Issue</a></li>
            </ul>
          </div> */}

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-accent" />git add .
                <span>North Western Industrial Zone Port Qasim Bin Qasim Town, Karachi</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-accent" />
                <span>+92 (310) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-accent" />
                <span>hr@company.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MY HR | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-accent transition duration-300">
    {icon}
  </a>
);

export default Footer;