// models/Issue.js
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    issueType: {
      type: String,
      enum: ["Payroll", "Leave", "Compliance", "Grievance", "Recruitment", "Benefits", "Other"],
      required: true,
    },
    avgResolutionTime: { 
      type: Number, 
      default: 0 
    },
    slaCompliance: { 
      type: Number, 
      default: 0 
    },   
    status: { 
      type: String, 
      enum: ["Open", "Closed"], 
      default: "Closed" 
    },

    month: { 
      type: String, 
      required: true 
    },
    year: { 
      type: Number, 
      required: true
    },

    issuesRaised: { 
      type: Number, 
      default: 0 
    },
    issuesResolved: { 
      type: Number, 
      default: 0 
    },

    department: { 
      type: String, 
      default: "HR Operations" 
    },
    designation: { 
      type: String, 
      default: "" 
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
