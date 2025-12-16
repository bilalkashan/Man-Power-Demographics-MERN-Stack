// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Calendar, 
//   Clock, 
//   ArrowRight, 
//   Tag, 
//   Search,
//   Bell
// } from 'lucide-react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const News = () => {
//   const [activeCategory, setActiveCategory] = useState('All');

//   // Filter Logic
//   const filteredNews = activeCategory === 'All' 
//     ? newsData 
//     : newsData.filter(item => item.category === activeCategory);

//   // Animation Variants
//   const fadeInUp = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />

//       {/* 1. Hero Section */}
//       <div className="bg-primary py-20 text-center text-white relative overflow-hidden">
//         {/* Decorative background element */}
//         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
//         <motion.div 
//           initial="hidden" 
//           animate="visible" 
//           variants={fadeInUp}
//           className="max-w-4xl mx-auto px-4 relative z-10"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Updates & Insights</h1>
//           <p className="text-lg text-gray-300">
//             Stay informed about company announcements, upcoming events, and industry news.
//           </p>
//         </motion.div>
//       </div>

//       {/* 2. Filter & Search Bar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
//         <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
//           {/* Category Buttons */}
//           <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
//             {['All', 'Company News', 'Events', 'Policy Update'].map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCategory(cat)}
//                 className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
//                   activeCategory === cat 
//                     ? 'bg-accent text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>

//           {/* Search (Visual Only for now) */}
//           <div className="relative w-full md:w-64">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input 
//               type="text" 
//               placeholder="Search articles..." 
//               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
//             />
//           </div>
//         </div>
//       </div>

//       {/* 3. News Grid */}
//       <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div 
//           layout
//           className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           <AnimatePresence>
//             {filteredNews.map((item) => (
//               <NewsCard key={item.id} item={item} />
//             ))}
//           </AnimatePresence>
//         </motion.div>

//         {/* Empty State if no news found */}
//         {filteredNews.length === 0 && (
//           <div className="text-center py-20 text-gray-500">
//             <p>No updates found for this category.</p>
//           </div>
//         )}
//       </section>

//       {/* 4. Newsletter Subscription */}
//       <section className="bg-white py-16 border-t border-gray-100">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
//             <Bell className="w-8 h-8" />
//           </div>
//           <h2 className="text-3xl font-bold text-primary mb-4">Never Miss an Update</h2>
//           <p className="text-gray-600 mb-8">
//             Subscribe to our internal newsletter to get the latest HR updates delivered to your inbox.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
//             <input 
//               type="email" 
//               placeholder="Enter your work email" 
//               className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50"
//             />
//             <button className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-slate-800 transition shadow-lg">
//               Subscribe
//             </button>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// };

// // --- Sub Component: News Card ---

// const NewsCard = ({ item }) => (
//   <motion.div
//     layout
//     initial={{ opacity: 0, scale: 0.9 }}
//     animate={{ opacity: 1, scale: 1 }}
//     exit={{ opacity: 0, scale: 0.9 }}
//     transition={{ duration: 0.3 }}
//     className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
//   >
//     {/* Image Container with Zoom Effect */}
//     <div className="relative h-48 overflow-hidden">
//       <div className="absolute top-4 left-4 z-10">
//         <span className={`px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-wider ${getCategoryColor(item.category)}`}>
//           {item.category}
//         </span>
//       </div>
//       <img 
//         src={item.image} 
//         alt={item.title} 
//         className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
//       />
//     </div>

//     {/* Content */}
//     <div className="p-6 flex flex-col flex-grow">
//       <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
//         <div className="flex items-center">
//           <Calendar className="w-3 h-3 mr-1" />
//           {item.date}
//         </div>
//         <div className="flex items-center">
//           <Clock className="w-3 h-3 mr-1" />
//           {item.readTime}
//         </div>
//       </div>

//       <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-accent transition-colors line-clamp-2">
//         {item.title}
//       </h3>
      
//       <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
//         {item.excerpt}
//       </p>

//       <button className="flex items-center text-accent text-sm font-bold hover:underline mt-auto">
//         Read Full Article <ArrowRight className="w-4 h-4 ml-1" />
//       </button>
//     </div>
//   </motion.div>
// );

// // Helper for badge colors
// const getCategoryColor = (category) => {
//   switch(category) {
//     case 'Events': return 'bg-orange-500';
//     case 'Policy Update': return 'bg-red-500';
//     default: return 'bg-accent';
//   }
// };

// // Dummy Data
// const newsData = [
//   {
//     id: 1,
//     category: "Events",
//     date: "Dec 15, 2025",
//     readTime: "2 min read",
//     title: "Annual Year-End Gala Dinner",
//     excerpt: "Join us for an evening of celebration, awards, and networking as we wrap up a successful year at the Grand Hotel.",
//     image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80"
//   },
//   {
//     id: 2,
//     category: "Policy Update",
//     date: "Dec 10, 2025",
//     readTime: "5 min read",
//     title: "Updated Remote Work Guidelines for 2026",
//     excerpt: "The HR department has released new guidelines regarding hybrid work models effective from January 1st.",
//     image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80"
//   },
//   {
//     id: 3,
//     category: "Company News",
//     date: "Nov 28, 2025",
//     readTime: "3 min read",
//     title: "We Achieved 'Great Place to Work' Certification",
//     excerpt: "We are proud to announce that our company has been recognized for its outstanding workplace culture.",
//     image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
//   },
//   {
//     id: 4,
//     category: "Events",
//     date: "Nov 20, 2025",
//     readTime: "4 hrs",
//     title: "Health & Wellness Workshop",
//     excerpt: "A mandatory workshop focusing on mental health awareness and stress management techniques for all employees.",
//     image: "https://images.unsplash.com/photo-1544367563-121955377d00?auto=format&fit=crop&q=80"
//   },
//   {
//     id: 5,
//     category: "Company News",
//     date: "Nov 15, 2025",
//     readTime: "4 min read",
//     title: "Welcoming Our New CTO",
//     excerpt: "Please join us in welcoming Mr. James Anderson to the executive leadership team.",
//     image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
//   },
//   {
//     id: 6,
//     category: "Policy Update",
//     date: "Nov 01, 2025",
//     readTime: "3 min read",
//     title: "New Health Insurance Benefits Added",
//     excerpt: "We have expanded our insurance coverage to include dental and vision for all permanent staff members.",
//     image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"
//   }
// ];

// export default News;



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Search, Bell } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api, { fileUrl } from "../api";

const News = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [newsItems, setNewsItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await api.get("/news");
        const items = res.data.news || [];
        setNewsItems(items);

        const cats = new Set(items.map((i) => i.category).filter(Boolean));
        setCategories(["All", ...Array.from(cats).sort()]);
      } catch (err) {
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Filter Logic
  const filteredNews =
    activeCategory === "All"
      ? newsItems
      : newsItems.filter((item) => item.category === activeCategory);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* 1. Hero Section */}
      <div className="bg-primary py-20 text-center text-white relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4 relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Latest Updates & Insights
          </h1>
          <p className="text-lg text-gray-300">
            Stay informed about company announcements, upcoming events, and
            industry news.
          </p>
        </motion.div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Category Buttons */}
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-accent text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search (Visual Only for now) */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 3. News Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                Loading news...
              </div>
            ) : (
              filteredNews.map((item) => (
                <NewsCard key={item._id} item={item} />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty State if no news found */}
        {filteredNews.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>No updates found for this category.</p>
          </div>
        )}
      </section>

      {/* 4. Newsletter Subscription */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
            <Bell className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Never Miss an Update
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our internal newsletter to get the latest HR updates
            delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your work email"
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50"
            />
            <button className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-slate-800 transition shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// --- Sub Component: News Card ---

const NewsCard = ({ item }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
  >
    {/* Image Container with Zoom Effect */}
    <div className="relative h-48 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-wider ${getCategoryColor(
            item.category
          )}`}
        >
          {item.category}
        </span>
      </div>
      <img
        src={
          item.image
            ? fileUrl(item.image)
            : "https://via.placeholder.com/800x450?text=No+Image"
        }
        alt={item.title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
      />
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {Math.max(
            1,
            Math.ceil(
              (item.content || item.summary || "").split(/\s+/).length / 200
            )
          )}{" "}
          min read
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-accent transition-colors line-clamp-2">
        {item.title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
        {item.summary ||
          (item.content
            ? item.content.slice(0, 160) +
              (item.content.length > 160 ? "..." : "")
            : "")}
      </p>

      <button className="flex items-center text-accent text-sm font-bold hover:underline mt-auto">
        Read Full Article <ArrowRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  </motion.div>
);

// Helper for badge colors
const getCategoryColor = (category) => {
  switch (category) {
    case "Events":
      return "bg-orange-500";
    case "Policy Update":
      return "bg-red-500";
    default:
      return "bg-accent";
  }
};

export default News;
