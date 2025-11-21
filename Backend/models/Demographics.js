import mongoose from "mongoose";

const demographicsSchema = new mongoose.Schema({
  Department: { type: String, required: true },    // e.g. HR, IT
  Designation: { type: String, default: "Staff" },// e.g. Manager, Executive
  Year: { type: Number, required: true },          // 2024, 2025
  Gender: { type: String },                        // Male/Female/Other
  Age: { type: Number },                           // years
  Tenure: { type: Number },                        // years
  Education: { type: String },                     // High School/Bachelors/etc
  Province: { type: String },                      // Province name (for map)
  City: { type: String },                          // City name
  lat: { type: Number },                           // optional lat for plotting
  lon: { type: Number }                            // optional lon for plotting
});

const Demographics = mongoose.model("Demographics", demographicsSchema);
export default Demographics;