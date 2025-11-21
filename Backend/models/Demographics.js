import mongoose from "mongoose";

const demographicsSchema = new mongoose.Schema({
  Department: { type: String, required: true },    
  Designation: { type: String, default: "Staff" },
  Year: { type: Number, required: true },          
  Gender: { type: String },                        
  Age: { type: Number },                           
  Tenure: { type: Number },                        
  Education: { type: String },                     
  Province: { type: String },                     
  City: { type: String },                         
  lat: { type: Number },                           
  lon: { type: Number }                           
});

const Demographics = mongoose.model("Demographics", demographicsSchema);
export default Demographics;