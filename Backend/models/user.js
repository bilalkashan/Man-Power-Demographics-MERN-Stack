import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  is_verified: { 
    type: Boolean, 
    default: false
  },
  lastLogin: { 
    type: Date 
  },
  otp: { 
    type: String, 
    required: false 
  },
  role: { 
    type: String, 
    enum: ["admin"], 
    default: "admin" 
  },
}, { 
  timestamps: true // Just add this object
});

export default mongoose.model("User", UserSchema);