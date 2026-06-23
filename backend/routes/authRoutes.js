import express from "express";
import {
  getMe,
  login,
  register,
  updateMe,
  uploadResumeController,
  uploadVideoResumeController
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume, uploadVideoResume } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/resume", protect, uploadResume.single("resume"), uploadResumeController);
router.post("/video-resume", protect, uploadVideoResume.single("videoResume"), uploadVideoResumeController);

export default router;
