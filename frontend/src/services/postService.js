import api from "./api";

export const getPosts = async (params) => (await api.get("/posts", { params })).data;
export const createPost = async (data) => (await api.post("/posts", data)).data;
export const deletePost = async (id) => (await api.delete(`/posts/${id}`)).data;
