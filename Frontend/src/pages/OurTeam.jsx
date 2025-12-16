import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OurTeam = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 1. Hero Section */}
      <div className="bg-primary py-20 text-center text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4"
        >
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Team of Dedicated Professionals
          </h1>
          <p className="text-lg text-gray-300">
            The experts behind your organizational success.
          </p>
        </motion.div>
      </div>

      {/* 2. Intro & Stats Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-primary mb-6">
              Driving Growth Through People
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              At NOW HR, we combine strategic insights with people-focused
              solutions to help businesses grow. Our team excels in building
              inclusive cultures, developing talent, and driving organizational
              transformation.
            </p>

            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition shadow-lg"
            >
              View All Services <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>

          {/* Right: Progress Bars / Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-primary p-8 rounded-2xl border border-gray-100 shadow-lg"
          >
            <div className="space-y-8">
              <SkillBar label="Talent Management" percentage="85%" />
              <SkillBar label="Leadership Development" percentage="95%" />
              <SkillBar label="Client Satisfaction" percentage="98%" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Team Grid */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary">
              Meet Our Experts
            </h2>
            <p className="text-gray-600 mt-2">
              Highly skilled professionals dedicated to your vision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamCard key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Sub Components ---

// 1. Skill Bar Component (animated fill + counting percentage)
const SkillBar = ({ label, percentage }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);

  const numeric = parseInt(String(percentage).replace(/\D/g, ""), 10) || 0;

  useEffect(() => {
    if (!started) return;
    let rafId;
    const duration = 1500; // ms
    const start = Date.now();

    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(numeric * easeOut));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, numeric]);

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      <div className="flex justify-between mb-2">
        <span className="font-bold text-gray-200">{label}</span>
        <span className="font-bold text-accent">{displayValue}%</span>
      </div>

      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </motion.div>
  );
};

// 2. Team Card Component
const TeamCard = ({ member }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden group border border-gray-100"
  >
    {/* Image Container */}
    <div className="relative h-80 overflow-hidden">
      <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors z-10"></div>
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover object-top transform group-hover:scale-110 transition duration-700"
      />

      {/* Social Overlay */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <SocialButton icon={<Linkedin className="w-4 h-4" />} />
        <SocialButton icon={<Twitter className="w-4 h-4" />} />
        <SocialButton icon={<Mail className="w-4 h-4" />} />
      </div>
    </div>

    {/* Content */}
    <div className="p-6 text-center">
      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
      <p className="text-accent font-medium mb-3">{member.role}</p>
      <div className="w-12 h-1 bg-gray-200 mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
    </div>
  </motion.div>
);

const SocialButton = ({ icon }) => (
  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition shadow-md">
    {icon}
  </button>
);

// --- Data ---
const teamMembers = [
  {
    name: "Muhammad Shoeb Khan",
    role: "Managing Director",
    bio: "With over 15 years in strategic HR, Sarah specializes in organizational restructuring and C-suite executive search.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
  },
  {
    name: "Muhammad Shoeb Khan",
    role: "Head of Talent & RPO",
    bio: "David leads our recruitment division, ensuring that our clients access the top 1% of talent in the market efficiently.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
  },
  {
    name: "Muhammad Shoeb Khan",
    role: "L&D Specialist",
    bio: "Emily designs our award-winning training programs, focusing on soft skills and leadership development for future managers.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80",
  },
];

export default OurTeam;
