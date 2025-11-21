// models/Leaver.js
import mongoose from "mongoose";

const leaverSchema = new mongoose.Schema({
  department: { 
    type: String, 
    required: true 
  },
  month: { 
    type: String, 
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  leavers: { 
    type: Number, 
    default: 0 
  },
  attritionRate: { 
    type: Number, 
    default: 0 
  },
  reason: { 
    type: String, 
    enum: ["Salary", "Career Growth", "Relocation", "Manager Issues", "Other"], 
    required: true 
  },
  voluntary: { 
    type: Boolean, 
    default: true 
  }, 
  tenureAtExit: { 
    type: Number, 
    default: 0 
  }, 
}, { timestamps: true });

const Leaver = mongoose.model("Leaver", leaverSchema);
export default Leaver;
