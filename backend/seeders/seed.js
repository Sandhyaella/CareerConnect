import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

dotenv.config();

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Job.deleteMany()]);

  const recruiter = await User.create({
    name: "Recruiter Demo",
    email: "recruiter@careerconnect.com",
    password: await bcrypt.hash("Password123", 10),
    role: "recruiter"
  });

  const candidate = await User.create({
    name: "Candidate Demo",
    email: "candidate@careerconnect.com",
    password: await bcrypt.hash("Password123", 10),
    role: "candidate",
    skills: ["React", "Node.js"]
  });

  await Job.insertMany([
    {
      title: "Frontend Developer",
      company: "TechNova",
      description: "Build modern interfaces using React.",
      salary: 80000,
      location: "Remote",
      category: "Software",
      type: "Full-time",
      skills: ["React", "JavaScript", "Bootstrap"],
      recruiter: recruiter._id
    },
    {
      title: "MERN Stack Engineer",
      company: "CloudStride",
      description: "Develop scalable MERN applications.",
      salary: 95000,
      location: "Bangalore",
      category: "Software",
      type: "Hybrid",
      skills: ["MongoDB", "Express", "React", "Node.js"],
      recruiter: recruiter._id
    }
  ]);

  console.log("Seed complete.");
  console.log("Recruiter: recruiter@careerconnect.com / Password123");
  console.log("Candidate: candidate@careerconnect.com / Password123");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
