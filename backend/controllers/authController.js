import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  return res.status(201).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      resume: user.resume,
      videoResume: user.videoResume
    }
  });
};

export const getMe = async (req, res) => {
  return res.json(req.user);
};

export const updateMe = async (req, res) => {
  const { name, skills } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  if (skills !== undefined) {
    user.skills = Array.isArray(skills)
      ? skills
      : String(skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  }
  await user.save();
  return res.json(user);
};

export const uploadResumeController = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Resume file is required" });
  const user = await User.findById(req.user._id);
  user.resume = `/uploads/resumes/${req.file.filename}`;
  await user.save();
  return res.json({ message: "Resume uploaded", resume: user.resume });
};

export const uploadVideoResumeController = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Video resume file is required" });
  const user = await User.findById(req.user._id);
  user.videoResume = `/uploads/video-resumes/${req.file.filename}`;
  await user.save();
  return res.json({ message: "Video resume uploaded", videoResume: user.videoResume });
};
