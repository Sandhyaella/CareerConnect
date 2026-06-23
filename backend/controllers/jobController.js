import Job from "../models/Job.js";

const parseSkills = (skills) =>
  Array.isArray(skills)
    ? skills
    : String(skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

const buildJobPayload = (body, file) => {
  const payload = {
    title: body.title,
    company: body.company,
    description: body.description,
    salary: Number(body.salary),
    location: body.location,
    category: body.category,
    type: body.type,
    skills: parseSkills(body.skills)
  };
  if (file) payload.companyLogo = `/uploads/company-logos/${file.filename}`;
  return payload;
};

export const getJobs = async (req, res) => {
  const { search, location, category, type, minSalary, maxSalary, page = 1, limit = 6 } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } }
    ];
  }
  if (location) query.location = { $regex: location, $options: "i" };
  if (category) query.category = category;
  if (type) query.type = type;
  if (minSalary || maxSalary) query.salary = { ...(minSalary && { $gte: Number(minSalary) }), ...(maxSalary && { $lte: Number(maxSalary) }) };

  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([
    Job.find(query).populate("recruiter", "name email").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Job.countDocuments(query)
  ]);
  res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate("recruiter", "name email");
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.json(job);
};

export const createJob = async (req, res) => {
  const payload = {
    ...buildJobPayload(req.body, req.file),
    recruiter: req.user._id
  };
  const job = await Job.create(payload);
  return res.status(201).json(job);
};

export const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.recruiter) !== String(req.user._id)) return res.status(403).json({ message: "Not owner of this job" });

  const updates = buildJobPayload(req.body, req.file);
  Object.assign(job, updates);
  if (req.body.skills !== undefined) job.skills = updates.skills;
  await job.save();
  return res.json(job);
};

export const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.recruiter) !== String(req.user._id)) return res.status(403).json({ message: "Not owner of this job" });
  await Job.findByIdAndDelete(req.params.id);
  return res.json({ message: "Job deleted" });
};
