import express from "express";
import { applyToJob, getMyApplications } from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/apply/:jobId", protect, authorizeRoles("candidate"), applyToJob);
router.get("/my", protect, authorizeRoles("candidate"), getMyApplications);

export default router;
