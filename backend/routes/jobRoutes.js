import express from "express";
import { createJob, deleteJob, getJobById, getJobs, updateJob } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { uploadCompanyLogo } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, authorizeRoles("recruiter"), uploadCompanyLogo.single("companyLogo"), createJob);
router.put("/:id", protect, authorizeRoles("recruiter"), uploadCompanyLogo.single("companyLogo"), updateJob);
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

export default router;
