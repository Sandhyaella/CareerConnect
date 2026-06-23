import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { getIo } from "../utils/socket.js";

export const applyToJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  const alreadyApplied = await Application.findOne({
    candidate: req.user._id,
    job: req.params.jobId
  });
  if (alreadyApplied) return res.status(409).json({ message: "You already applied to this job" });

  const application = await Application.create({
    candidate: req.user._id,
    job: req.params.jobId
  });
  const io = getIo();
  if (io) {
    io.to(`user:${job.recruiter}`).emit("application:new", {
      jobId: job._id,
      candidateId: req.user._id,
      applicationId: application._id
    });
  }
  return res.status(201).json(application);
};

export const getMyApplications = async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({
      path: "job",
      populate: { path: "recruiter", select: "name email" }
    })
    .sort({ appliedAt: -1 });
  return res.json(applications);
};
