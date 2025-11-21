import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  month: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  totalPayroll: { 
    type: Number, 
    required: true 
  },
  basic: { 
    type: Number, 
    default: 0 
  },
  allowances: { 
    type: Number, 
    default: 0 
  },
  overtime: { 
    type: Number, 
    default: 0 
  },
  bonus: { 
    type: Number, 
    default: 0 
  },
  incentives: { 
    type: Number, 
    default: 0 
  },
  headcount: { 
    type: Number,
    required: true 
  },
  revenue: { 
    type: Number,
    required: true 
  },
  leavers: { 
    type: Number,
    required: true 
  },
  tax: { 
    type: Number,
    required: true  
  },
  employerContribution: { 
    type: Number,
    required: true
  },
  totalCostOfEmployment: { 
    type: Number,
    required: true 
  },
}, { timestamps: true });

const Payroll = mongoose.model("Payroll", payrollSchema);
export default Payroll;