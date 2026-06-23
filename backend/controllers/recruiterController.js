import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { getIo } from "../utils/socket.js";

export const getDashboard = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).select("_id");
  const jobIds = jobs.map((j) => j._id);

  const [totalJobs, totalApplicants, pending, shortlisted] = await Promise.all([
    Job.countDocuments({ recruiter: req.user._id }),
    Application.countDocuments({ job: { $in: jobIds } }),
    Application.countDocuments({ job: { $in: jobIds }, status: "Pending" }),
    Application.countDocuments({ job: { $in: jobIds }, status: "Shortlisted" })
  ]);

  return res.json({ totalJobs, totalApplicants, pendingApplications: pending, shortlistedCandidates: shortlisted });
};

export const getRecruiterJobs = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
  return res.json(jobs);
};

export const getApplicantsByJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.recruiter) !== String(req.user._id)) return res.status(403).json({ message: "Not owner of this job" });
  const applicants = await Application.find({ job: req.params.jobId })
    .populate("candidate", "name email skills resume videoResume")
    .populate("job", "title company");
  return res.json(applicants);
};

export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Shortlisted", "Rejected"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const app = await Application.findById(req.params.applicationId).populate("job");
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (String(app.job.recruiter) !== String(req.user._id)) return res.status(403).json({ message: "Not owner of this job" });

  app.status = status;
  await app.save();
  const io = getIo();
  if (io) {
    io.to(`user:${app.candidate}`).emit("application:statusUpdated", {
      applicationId: app._id,
      status: app.status
    });
    io.to(`user:${req.user._id}`).emit("application:statusUpdated", {
      applicationId: app._id,
      status: app.status
    });
  }
  return res.json(app);
};
