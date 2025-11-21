// models/TrainingRecord.js
import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema(
  {
    department: { type: String, required: true, index: true },
    trainingType: {
      type: String,
      enum: ["Technical", "Leadership", "Compliance", "Other"],
      default: "Other",
      index: true,
    },

    month: { 
      type: String, 
      required: true 
    },
    year: { 
      type: Number, 
      required: true, 
      index: true 
    },

    trainingsConducted: { 
      type: Number, 
      default: 0 
    },
    trainingHours: { 
      type: Number, 
      default: 0 
    },        
    participationPercent: { 
      type: Number, 
      default: 0 
    }, 
    participants: { 
      type: Number, 
      default: 0 
    },        
  },
  { timestamps: true }
);

const TrainingRecord = mongoose.model("TrainingRecord", trainingSchema);
export default TrainingRecord;
