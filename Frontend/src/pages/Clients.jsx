import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Quote, 
  Star, 
  ArrowRight, 
  Globe, 
  Briefcase, 
  Cpu, 
  ShoppingBag 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Clients = () => {
  // Animation Variants (Consistent with other pages)
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 1. Hero Section (Consistent Theme) */}
      <div className="bg-primary py-20 text-center text-white">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Valued Partners</h1>
          <p className="text-lg text-gray-300">
            Trusted by industry leaders to manage their most valuable asset — their people.
          </p>
        </motion.div>
      </div>

      {/* 2. Client Logo Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Companies We Serve</h2>
          <p className="text-gray-600 mt-2">Powering HR operations for diverse sectors.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
        >
          {/* Placeholder Logos - In a real app, replace <Building2> with <img> tags */}
          {clientsList.map((client, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center justify-center p-8 bg-gray-50 shadow-md border border-gray-100 rounded-xl hover:shadow-md hover:border-accent/30 transition-all duration-300 group cursor-pointer"
            >
              <Building2 className="w-10 h-10 text-gray-400 group-hover:text-accent transition-colors mb-3" />
              <span className="font-bold text-gray-500 group-hover:text-primary transition-colors">{client}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. Industries Served (Dark Section for Contrast) */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold mb-6">Expertise Across Industries</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Our HR solutions are not one-size-fits-all. We tailor our strategies to meet the unique regulatory and operational demands of specific sectors.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <IndustryItem icon={<Cpu />} label="Technology & IT" />
                <IndustryItem icon={<Briefcase />} label="Finance & Banking" />
                <IndustryItem icon={<ShoppingBag />} label="Retail & E-commerce" />
                <IndustryItem icon={<Globe />} label="Logistics & Supply Chain" />
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative"
            >
              {/* Abstract decorative image */}
              <div className="absolute -inset-4 bg-accent/20 rounded-xl transform -rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80" 
                alt="Business Meeting" 
                className="relative rounded-xl shadow-2xl w-full object-cover" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Client Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary">What Our Clients Say</h2>
            <p className="text-gray-600 mt-2">Feedback from the people we work with daily.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The recruitment team was exceptional. They filled our senior technical roles in record time with high-quality candidates."
              author="Syed Pervaiz Ahmed"
              role="CTO, TechFlow Inc."
            />
            <TestimonialCard 
              quote="Outsourcing our payroll to this team was the best decision we made. 100% accuracy and compliance every month."
              author="Bilal Kashan"
              role="Director, Apex Logistics"
            />
            <TestimonialCard 
              quote="Their training programs completely transformed our middle management layer. Highly recommended for OD interventions."
              author="Maliha Memon"
              role="HR Manager, BrightRetail"
            />
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Join Our Growing Network</h2>
          <p className="text-gray-600 mb-8">
            Ready to elevate your organization's human resource potential?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-full font-bold hover:bg-blue-600 transition shadow-lg"
          >
            Become a Partner <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Sub Components

const IndustryItem = ({ icon, label }) => (
  <div className="flex items-center space-x-3 bg-blue-900/50 p-4 rounded-lg border border-blue-700/50">
    <div className="text-accent">{icon}</div>
    <span className="font-medium text-white">{label}</span>
  </div>
);

const TestimonialCard = ({ quote, author, role }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative"
  >
    <Quote className="w-10 h-10 text-accent/20 absolute top-6 left-6" />
    <div className="flex text-yellow-400 mb-4 mt-2">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
    </div>
    <p className="text-gray-600 mb-6 italic relative z-10">"{quote}"</p>
    <div>
      <h4 className="font-bold text-primary">{author}</h4>
      <p className="text-sm text-accent">{role}</p>
    </div>
  </motion.div>
);

const clientsList = [
  "TechFlow Systems", "Global Logistics", "Apex Finance", "Urban Retail", 
  "MediCare Plus", "Future Ed", "BuildRight Const.", "Green Energy Co.", 
  "SoftServe Ltd.", "Alpha Motors"
];

export default Clients;