import mongoose from "mongoose";

const engagementSchema = new mongoose.Schema({
  Month: { 
    type: String, 
    required: true 
  },
  Department: { 
    type: String, 
    required: true 
  },
  Leadership: { 
    type: Number, 
    default: 0 
  },
  Recognition: { 
    type: Number, 
    default: 0 
  },
  Growth: { 
    type: Number, 
    default: 0 
  },
  WorkLifeBalance: { 
    type: Number, 
    default: 0 
  },
  EngagementScore: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

const Engagement = mongoose.model("Engagement", engagementSchema);
export default Engagement;
