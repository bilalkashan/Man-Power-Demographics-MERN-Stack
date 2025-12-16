import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Users, Award, TrendingUp, Quote } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ourMissionPic from "../assets/Our-Mission.png";

const About = () => {
  // Animation variants for smooth scrolling
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-white">
      {/* 1. Header Hero Section */}
      <Navbar />
      <div className="bg-primary py-20 text-center text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Driving Organizational Excellence
          </h1>
          <p className="text-lg text-gray-300">
            We are the bridge between the organization's goals and the people
            who achieve them.
          </p>
        </motion.div>
      </div>

      {/* 2. Mission & Vision - Split Layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-primary mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              To foster a work environment that inspires innovation,
              inclusivity, and growth. We believe that our greatest asset is our
              human capital, and we are dedicated to nurturing talent to drive
              the company forward.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Strategic Alignment
                  </h3>
                  <p className="text-sm text-gray-500">
                    Aligning HR strategies with business goals.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Continuous Growth
                  </h3>
                  <p className="text-sm text-gray-500">
                    Promoting learning and development at all levels.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-accent/20 rounded-xl transform rotate-3"></div>
            <img
              src={ourMissionPic}
              alt="Office Meeting"
              className="relative rounded-xl shadow-lg w-full object-cover h-[400px]"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. The HOD Message (CRITICAL SECTION) */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex"
          >
            <div className="md:w-2/5">
              <img
                // src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
                alt="Head of Department"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
              <Quote className="w-10 h-10 text-accent/30 mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-4">
                A Message from the HOD
              </h3>
              <p className="text-gray-600 italic mb-6">
                "We are not just managing resources; we are building the future.
                Our department is committed to transparency, efficiency, and
                creating a culture where every employee feels valued and
                empowered to succeed."
              </p>
              <div>
                <p className="font-bold text-gray-900">Muhammad Shoeb Khan</p>
                <p className="text-accent text-sm">Head of Human Resources</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Statistics / Impact */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white-800/50">
            <StatCard number="500+" label="Employees" />
            <StatCard number="98%" label="Retention Rate" />
            <StatCard number="50+" label="Training Programs" />
            <StatCard number="24hour" label="Support" />
          </div>
        </div>
      </section>

      {/* 5. Core Values Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary">Our Core Values</h2>
          <p className="mt-4 text-gray-600">
            The principles that guide our every decision.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard
            icon={<Users className="w-8 h-8 text-white" />}
            title="Inclusivity"
            desc="Creating a diverse environment where everyone belongs."
          />
          <ValueCard
            icon={<Award className="w-8 h-8 text-white" />}
            title="Excellence"
            desc="Striving for the highest quality in every process."
          />
          <ValueCard
            icon={<TrendingUp className="w-8 h-8 text-white" />}
            title="Innovation"
            desc="Embracing new technologies to streamline HR."
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ number, label }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Extract numeric value from the number string
  const numericValue = parseInt(number.replace(/[^0-9]/g, ""));
  const suffix = number.replace(/[0-9]/g, ""); // e.g., "+", "%", "/7"

  useEffect(() => {
    let animationFrameId;
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentValue = Math.floor(numericValue * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [numericValue]);

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl font-bold text-white mb-2">
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <div className="text-accent font-medium">{label}</div>
    </motion.div>
  );
};

const ValueCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-6 shadow-md">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </motion.div>
);

export default About;
