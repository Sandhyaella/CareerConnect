import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  if (!userId) return null;
  if (socket?.connected) return socket;
  socket = io(import.meta.env.VITE_BASE_URL || "http://localhost:5000", {
    auth: { userId }
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
