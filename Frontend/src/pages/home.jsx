import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Target,
  Clock,
  ArrowRight,
  Calendar,
  Users,
  FileText,
  Briefcase,
  Building2,
} from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api, { fileUrl } from "../api.jsx";

const Home = () => {
  // Animation Variant
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      try {
        const res = await api.get("/news?limit=3");
        if (mounted) setNews(res.data?.news || []);
      } catch (err) {
        if (mounted) setNewsError(err.message || "Failed to load news");
      } finally {
        if (mounted) setLoadingNews(false);
      }
    };

    fetchNews();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-white">
      <Navbar />
      <HeroSlider />

      {/* 1. Welcome Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-accent font-semibold tracking-wider uppercase text-sm">
            Welcome to My HR
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary">
            Building a World-Class Workforce
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto my-6 rounded-full"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our Human Resources department is dedicated to fostering a culture
            of innovation, inclusivity, and professional growth. We serve as the
            strategic partner to the organization, ensuring that our people have
            the resources they need to excel.
          </p>
        </motion.div>
      </section>

      {/* 2. Stats Strip */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white divide-x divide-white-800/50">
            <StatItem number="1,200+" label="Active Employees" />
            <StatItem number="98%" label="Satisfaction Rate" />
            <StatItem number="45" label="Active Recruitments" />
            <StatItem number="15yrs" label="Industry Excellence" />
          </div>
        </div>
      </section>

      {/* 3. Services Preview (NEW SECTION) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">
              Our Key Services
            </h2>
            <p className="mt-2 text-gray-600">
              Comprehensive solutions for every stage of the employee lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Users className="w-8 h-8" />}
              title="Talent Acquisition"
              desc="Strategic recruitment to find the perfect fit for technical and operational roles."
            />
            <ServiceCard
              icon={<FileText className="w-8 h-8" />}
              title="Payroll & Benefits"
              desc="Ensuring accurate compensation, tax compliance, and competitive benefit packages."
            />
            <ServiceCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Training & Development"
              desc="Continuous learning programs to upskill our workforce for future challenges."
            />
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="text-accent font-bold hover:text-primary transition flex items-center justify-center"
            >
              View All Services <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Core Values (Existing) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary">
                Department Core Values
              </h2>
              <p className="mt-2 text-gray-600">
                The pillars that define our operational philosophy.
              </p>
            </div>
            <Link
              to="/about"
              className="hidden md:flex items-center text-accent font-semibold hover:underline mt-4 md:mt-0"
            >
              View Vision & Mission <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Shield className="w-8 h-8 text-white" />}
              title="Integrity & Trust"
              desc="We handle sensitive information with the utmost confidentiality and uphold ethical standards."
            />
            <ValueCard
              icon={<Target className="w-8 h-8 text-white" />}
              title="Strategic Alignment"
              desc="We align talent acquisition strategies directly with the long-term goals of the company."
            />
            <ValueCard
              icon={<Clock className="w-8 h-8 text-white" />}
              title="Operational Efficiency"
              desc="Leveraging technology to streamline payroll, benefits, and attendance."
            />
          </div>
        </div>
      </section>

      {/* 5. Clients / Partners Preview (NEW SECTION) */}
      <section className="py-12 bg-gray-50 border-y border-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-primary mb-12 uppercase tracking-widest">
            Trusted Partners & Clients
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70 ">
            {[
              "TechFlow",
              "Apex Systems",
              "Global Logistics",
              "Future Ed",
              "MediCare+",
            ].map((client, i) => (
              <div
                key={i}
                className="flex flex-col items-center group cursor-pointer hover:opacity-100 transition duration-300"
              >
                <Building2 className="w-10 h-10 text-gray-400 group-hover:text-accent mb-2 transition" />
                <span className="font-bold text-gray-800 group-hover:text-primary transition">
                  {client}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/clients"
              className="text-sm text-accent hover:text-primary transition"
            >
              See all partners &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Latest News (Existing) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-primary">Latest Updates</h2>
          <Link
            to="/news"
            className="hidden md:block px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-primary hover:text-white transition"
          >
            View All News
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loadingNews ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow border border-gray-100"
              >
                <div className="rounded-xl mb-4 h-48 bg-gray-100 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            ))
          ) : news && news.length ? (
            news.map((n) => (
              <NewsCard
                key={n._id}
                category={n.category}
                date={new Date(n.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
                title={n.title}
                desc={n.summary || n.content || ""}
                img={fileUrl(n.image)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              No updates available.
            </div>
          )}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            to="/news"
            className="inline-block px-8 py-3 bg-white border border-primary text-primary font-bold rounded-full"
          >
            View All News
          </Link>
        </div>

        <div className="text-center mt-16 p-10 bg-blue-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-600 mb-6">
            Our HR Helpdesk is available 24/7 to answer your queries.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-full hover:bg-blue-600 transition shadow-lg"
          >
            Contact HR Support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Sub Components ---

const StatItem = ({ number, label }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Extract numeric value from the number string
  const numericValue = parseInt(number.replace(/[^0-9]/g, ""));
  const suffix = number.replace(/[0-9]/g, ""); // e.g., "+", "%", "yrs"

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
      className="p-2"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs md:text-sm text-blue-200 uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );
};

const ServiceCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300 text-center group"
  >
    <div className="w-16 h-16 bg-blue-50 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition">
      {title}
    </h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </motion.div>
);

const ValueCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300"
  >
    <div className="w-14 h-14 bg-slate-700 rounded-lg flex items-center justify-center mb-6 shadow-md">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

const NewsCard = ({ category, date, title, desc, img }) => (
  <div className="group cursor-pointer">
    <div className="overflow-hidden rounded-xl mb-4 relative h-48 bg-gray-200">
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-primary uppercase z-10">
        {category}
      </div>
      <img
        src={img}
        alt="News"
        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
      />
    </div>
    <div className="flex items-center text-gray-400 text-xs mb-2">
      <Calendar className="w-3 h-3 mr-1" /> {date}
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-accent transition">
      {title}
    </h3>
    <p className="text-gray-600 text-sm line-clamp-2">{desc}</p>
  </div>
);

export default Home;
