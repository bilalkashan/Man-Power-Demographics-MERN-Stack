import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

const AdminCreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: 'Karachi',
    category: 'Developer',
    type: 'Full Time',
    salary: '',
    description: '',
    requirements: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', formData);
      alert('Job Posted Successfully!');
      setFormData({
        title: '', location: 'Karachi', category: 'Developer', type: 'Full Time', salary: '', description: '', requirements: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error posting job');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-primary mb-6">Post a New Job</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Senior React Developer" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="HR">HR</option>
                  <option value="Management">Management</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary (Optional)</label>
                <input name="salary" value={formData.salary} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. 150k - 200k" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Requirements</label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border rounded-lg" placeholder="List requirements..."></textarea>
            </div>

            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-slate-800 transition">Post Job</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateJob;