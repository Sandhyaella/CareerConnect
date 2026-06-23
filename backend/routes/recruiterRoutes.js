import express from "express";
import {
  getApplicantsByJob,
  getDashboard,
  getRecruiterJobs,
  updateApplicationStatus
} from "../controllers/recruiterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("recruiter"), getDashboard);
router.get("/jobs", protect, authorizeRoles("recruiter"), getRecruiterJobs);
router.get("/applicants/:jobId", protect, authorizeRoles("recruiter"), getApplicantsByJob);
router.put("/status/:applicationId", protect, authorizeRoles("recruiter"), updateApplicationStatus);

export default router;
