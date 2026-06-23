import api from "./api";

export const applyToJob = async (jobId) => (await api.post(`/applications/apply/${jobId}`)).data;
export const getMyApplications = async () => (await api.get("/applications/my")).data;
