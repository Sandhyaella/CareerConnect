import api from "./api";

export const getJobs = async (params) => (await api.get("/jobs", { params })).data;
export const getJobById = async (id) => (await api.get(`/jobs/${id}`)).data;
export const createJob = async (data) => {
  if (data instanceof FormData) {
    return (
      await api.post("/jobs", data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
    ).data;
  }
  return (await api.post("/jobs", data)).data;
};
export const updateJob = async (id, data) => {
  if (data instanceof FormData) {
    return (
      await api.put(`/jobs/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
    ).data;
  }
  return (await api.put(`/jobs/${id}`, data)).data;
};
export const deleteJob = async (id) => (await api.delete(`/jobs/${id}`)).data;
