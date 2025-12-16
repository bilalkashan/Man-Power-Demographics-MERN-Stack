import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    candidateEmail: {
      type: String,
      required: true,
    },
    candidatePhone: {
      type: String,
    },
    resume: {
      type: String, // URL or file path
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Shortlisted", "Rejected", "Hired"],
      default: "Applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
