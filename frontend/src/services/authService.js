import api from "./api";

export const registerUser = async (data) => (await api.post("/auth/register", data)).data;
export const loginUser = async (data) => (await api.post("/auth/login", data)).data;
export const fetchMe = async () => (await api.get("/auth/me")).data;
export const updateProfile = async (data) => (await api.put("/auth/me", data)).data;
export const uploadResume = async (formData, onUploadProgress) =>
  (
    await api.post("/auth/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress
    })
  ).data;

export const uploadVideoResume = async (formData, onUploadProgress) =>
  (
    await api.post("/auth/video-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress
    })
  ).data;
