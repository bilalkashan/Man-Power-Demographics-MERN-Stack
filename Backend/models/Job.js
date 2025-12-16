const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "MY HR" },
  location: { type: String, required: true }, // e.g., Karachi
  type: { type: String, required: true }, // e.g., Full Time, Contract
  category: { type: String, required: true }, // e.g., Developer, HR, Finance
  description: { type: String, required: true },
  requirements: { type: String }, // Stored as a long string or HTML
  salary: { type: String },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);