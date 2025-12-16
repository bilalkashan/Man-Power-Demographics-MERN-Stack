import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, DollarSign, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ApplicationForm from "../components/ApplicationForm";
import api from "../api";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleApply = (e) => {
    e.preventDefault();
    // Handled by ApplicationForm component
  };

  const handleApplicationSuccess = () => {
    setIsApplying(false);
  };

  if (!job) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/jobs"
          className="text-gray-500 hover:text-accent flex items-center mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {job.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">{job.company}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center bg-gray-100 px-3 py-1 rounded">
                  <MapPin className="w-4 h-4 mr-2" /> {job.location}
                </span>
                <span className="flex items-center bg-gray-100 px-3 py-1 rounded">
                  <Briefcase className="w-4 h-4 mr-2" /> {job.category}
                </span>
                <span className="flex items-center bg-gray-100 px-3 py-1 rounded">
                  <Clock className="w-4 h-4 mr-2" /> {job.type}
                </span>
                {job.salary && (
                  <span className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded">
                    <DollarSign className="w-4 h-4 mr-2" /> {job.salary}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsApplying(true)}
              className="mt-6 md:mt-0 px-8 py-3 bg-accent text-white font-bold rounded-lg hover:bg-blue-600 transition shadow-lg"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Job Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Job Description
              </h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Requirements
              </h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {job.requirements}
              </p>
            </div>
          </div>

          {/* Application Form */}
          {isApplying && (
            <ApplicationForm
              jobId={job._id}
              jobTitle={job.title}
              onClose={() => setIsApplying(false)}
              onSuccess={handleApplicationSuccess}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;
