import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["candidate", "recruiter"], required: true },
    skills: [{ type: String }],
    resume: { type: String, default: "" },
    videoResume: { type: String, default: "" },
    profileImage: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
