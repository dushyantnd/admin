// models/University.js
import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema({
  rank: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  logo: { type: String, required: true },
  country: { type: String, required: true, default: "US" },
});

export default mongoose.models.University || mongoose.model("University", UniversitySchema);