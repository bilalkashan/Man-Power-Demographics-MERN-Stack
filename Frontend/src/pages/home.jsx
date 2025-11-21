import React from "react";
import { Link } from "react-router-dom";
import MMCLLogo from "../assets/MMC-Logo.png";
import DashboardIllustration from "../assets/man power.jpg";

function Home() {
  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Animated Abstract background shapes */}
      <div className="absolute top-0 left-0 transform -translate-x-1/3 -translate-y-1/3">
        <div className="w-[500px] h-[500px] bg-indigo-100 rounded-full opacity-50 animate-subtle-float"></div>
      </div>
      <div className="absolute bottom-0 right-0 transform translate-x-1/3 translate-y-1/3">
        <div className="w-[500px] h-[500px] bg-sky-100 rounded-full opacity-60 animate-subtle-float animation-delay-3000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-8 py-6 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img 
              src={MMCLLogo}
              alt="MM Logo" 
              className="h-8" 
            />
          </div>
        </header>

        {/* Main content with a two-column layout */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Column 1: Staggered Animation Text Content & CTA */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 mb-6 leading-tight animate-fade-up">
                Data-Driven Workforce Insights
              </h1>
              <p className="text-lg text-slate-700 mb-10 max-w-lg mx-auto md:mx-0 animate-fade-up animation-delay-300">
                Visualize key demographics, analyze trends, and empower your organization with our modern dashboard.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 animate-fade-up animation-delay-600"
              >
                Access Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Column 2: Polished Illustration/Graphic */}
            <div className="hidden md:block animate-fade-up animation-delay-900">
               {/* Added a shadow and rounded corners to the image for a polished look */}
              <img
                src={DashboardIllustration}
                alt="Manpower Demographics Dashboard Illustration"
                className="w-full h-auto max-h-[450px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </main>

        <footer className="text-center py-6 text-gray-500 text-xs">
           &copy; {new Date().getFullYear()} Master Motor Corporation Ltd. All rights reserved | Developed by Human Resource Department
        </footer>
      </div>

      <style>
        {`
          /* --- ANIMATION FIXES & ENHANCEMENTS --- */

          /* Staggered fade-up animation for text content */
          .animate-fade-up {
            animation: fadeUp 0.8s ease-out forwards;
            opacity: 0; /* Start hidden */
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Subtle floating animation for background shapes */
          .animate-subtle-float {
             animation: subtleFloat 6s ease-in-out infinite;
          }

          @keyframes subtleFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-25px);
            }
          }
          
          /* Animation delay utilities */
          .animation-delay-300 { animation-delay: 300ms; }
          .animation-delay-600 { animation-delay: 600ms; }
          .animation-delay-900 { animation-delay: 900ms; }
          .animation-delay-3000 { animation-delay: 3000ms; }
        `}
      </style>
    </div>
  );
}

export default Home;

