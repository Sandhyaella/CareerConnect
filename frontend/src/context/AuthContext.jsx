import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginUser, registerUser } from "../services/authService";
import { connectSocket, disconnectSocket, getSocket } from "../services/socketService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = async () => {
    const token = localStorage.getItem("cc_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      localStorage.removeItem("cc_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (user?._id || user?.id) {
      connectSocket(user._id || user.id);
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [user?._id, user?.id]);

  const login = async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem("cc_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem("cc_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("cc_token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, loading, login, register, logout, socket: getSocket() }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
