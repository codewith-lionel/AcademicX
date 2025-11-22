import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

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
  const [token, setToken] = useState(localStorage.getItem("studentToken"));

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("studentToken");
      const savedUser = localStorage.getItem("studentUser");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Set default axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/student/login",
        {
          email,
          password,
        }
      );

      const { token, student } = response.data;

      localStorage.setItem("studentToken", token);
      localStorage.setItem("studentUser", JSON.stringify(student));

      setToken(token);
      setUser(student);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/student/register",
        userData
      );

      const { token, student } = response.data;

      localStorage.setItem("studentToken", token);
      localStorage.setItem("studentUser", JSON.stringify(student));

      setToken(token);
      setUser(student);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentUser");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/students/profile",
        updates
      );
      const updatedUser = response.data.student;

      setUser(updatedUser);
      localStorage.setItem("studentUser", JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
