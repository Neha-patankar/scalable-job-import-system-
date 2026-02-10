import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, unique: true },
    title: String,
    company: String,
    location: String,
    url: String,
    category: String,
    type: String,
    description: String,
    source: String
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
