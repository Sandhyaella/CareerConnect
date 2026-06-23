import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import morgan from "morgan";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { verifyConversationAccess } from "./controllers/chatController.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import { setIo } from "./utils/socket.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setIo(io);
io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    socket.join(`user:${userId}`);
  }

  socket.on("chat:join", async (conversationId) => {
    if (!userId || !conversationId) return;
    const conversation = await verifyConversationAccess(conversationId, userId);
    if (conversation) socket.join(`conversation:${conversationId}`);
  });

  socket.on("chat:leave", (conversationId) => {
    if (conversationId) socket.leave(`conversation:${conversationId}`);
  });
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
