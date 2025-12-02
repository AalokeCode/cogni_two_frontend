"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "@/utils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await userAPI.getMe();
      setUser(data.data);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem("token", data.data.token);
      setUser(data.data.user);
      toast.success("Login successful");
      router.push("/app/dashboard");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem("token", data.data.token);
      setUser(data.data.user);
      toast.success("Registration successful");
      router.push("/app/dashboard");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
    router.push("/signin");
  };

  const updateUser = async (updates) => {
    try {
      const data = await userAPI.updateProfile(updates);
      setUser(data.data);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
