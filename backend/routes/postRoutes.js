import express from "express";
import { createPost, deletePost, getPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, authorizeRoles("candidate", "recruiter"), createPost);
router.delete("/:id", protect, authorizeRoles("candidate", "recruiter"), deletePost);

export default router;
