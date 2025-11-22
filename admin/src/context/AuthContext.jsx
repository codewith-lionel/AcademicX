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
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("adminToken");
      const savedAdmin = localStorage.getItem("adminUser");

      if (savedToken && savedAdmin) {
        setToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/admin/login",
        {
          username,
          password,
        }
      );

      const { token, admin } = response.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(admin));

      setToken(token);
      setAdmin(admin);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (username, email, password, name, registrationKey) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/admin/register",
        {
          username,
          email,
          password,
          name,
          registrationKey,
        }
      );

      const { token, admin } = response.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(admin));

      setToken(token);
      setAdmin(admin);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setAdmin(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    admin,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
