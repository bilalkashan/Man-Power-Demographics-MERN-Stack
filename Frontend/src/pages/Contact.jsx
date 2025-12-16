import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/messages", formData);
      if (res.data.success) {
        toast.success(
          "Message sent successfully! We will get back to you soon."
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Same animation variant as About Page
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 1. Header Hero Section (Matches About Theme) */}
      <div className="bg-primary py-20 text-center text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-300">
            Have a question about careers, benefits, or policies? We are here to
            help.
          </p>
        </motion.div>
      </div>

      {/* 2. Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Info Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-primary mb-6">
                Head Office
              </h3>
              <div className="space-y-6">
                <InfoItem
                  icon={<MapPin className="w-5 h-5" />}
                  title="Address"
                  content="North Western Industrial Zone Port Qasim Bin Qasim Town, Karachi"
                />
                <InfoItem
                  icon={<Phone className="w-5 h-5" />}
                  title="Phone"
                  content="+92 (000) 123-4567"
                />
                <InfoItem
                  icon={<Mail className="w-5 h-5" />}
                  title="General Inquiry"
                  content="hr@company.com"
                />
              </div>
            </motion.div>

            {/* Office Hours Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-primary p-6 rounded-xl shadow-lg text-white"
            >
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-white mr-3" />
                <h3 className="text-xl font-bold">Office Hours</h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-red-400">Closed</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-2 bg-gray-50 rounded-xl shadow-lg border border-gray-100 p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-primary mb-2">
              Send us a Message
            </h2>
            <p className="text-gray-600 mb-8">
              Please fill out the form below and we will get back to you within
              24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition outline-none bg-white"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition outline-none bg-white"
                    placeholder="john@example.com"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition outline-none bg-white"
                  onChange={handleChange}
                >
                  <option value="">Select a topic...</option>
                  <option value="recruitment">
                    Job Application / Recruitment
                  </option>
                  <option value="payroll">Payroll & Salary</option>
                  <option value="complaint">Grievance / Complaint</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition outline-none bg-white"
                  placeholder="How can we help you?"
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* 3. Department Directory (Bottom Section) */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            Specific Department Contacts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <DeptCard
              icon={<FileText className="w-6 h-6 text-primary" />}
              title="Recruitment Team"
              email="careers@company.com"
              desc="For job applications and interview status."
            />
            <DeptCard
              icon={<HelpCircle className="w-6 h-6 text-primary" />}
              title="Employee Benefits"
              email="benefits@company.com"
              desc="Insurance, leaves, and perks inquiries."
            />
            <DeptCard
              icon={<MessageSquare className="w-6 h-6 text-primary" />}
              title="Grievance Cell"
              email="support@company.com"
              desc="Confidential reporting and conflict resolution."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Sub Components (Styled to match About Page cards)

const InfoItem = ({ icon, title, content }) => (
  <div className="flex items-start">
    <div className="bg-blue-50 p-2 rounded-lg text-accent mr-4">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      <p className="text-gray-600 text-sm">{content}</p>
    </div>
  </div>
);

const DeptCard = ({ icon, title, email, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition text-center"
  >
    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-primary mb-1">{title}</h3>
    <a
      href={`mailto:${email}`}
      className="text-accent hover:underline text-sm font-medium block mb-2"
    >
      {email}
    </a>
    <p className="text-xs text-gray-500">{desc}</p>
  </motion.div>
);

export default Contact;
