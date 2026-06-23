import api from "./api";

export const getDashboard = async () => (await api.get("/recruiter/dashboard")).data;
export const getRecruiterJobs = async () => (await api.get("/recruiter/jobs")).data;
export const getApplicantsByJob = async (jobId) => (await api.get(`/recruiter/applicants/${jobId}`)).data;
export const updateApplicationStatus = async (applicationId, status) =>
  (await api.put(`/recruiter/status/${applicationId}`, { status })).data;
