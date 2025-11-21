import mongoose from "mongoose";

const hiringSchema = new mongoose.Schema({
  department: { 
    type: String, 
    required: true 
  },
  stageCounts: {
    applications: { 
      type: Number, 
      default: 0 
    },
    shortlisted: { 
      type: Number, 
      default: 0 
    },
    interviewed: { 
      type: Number, 
      default: 0 
    },
    offers: { 
      type: Number, 
      default: 0 
    },
    hired: { 
      type: Number, 
      default: 0 
    },
  },
  timeToHire: { 
    type: Number, 
    default: 0 
  }, // days
  offerAcceptanceRate: { 
    type: Number, 
    default: 0 
  }, // %
  hires: { 
    type: Number, 
    default: 0 
  }, 
  month: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

const Hiring = mongoose.model("Hiring", hiringSchema);
export default Hiring;
