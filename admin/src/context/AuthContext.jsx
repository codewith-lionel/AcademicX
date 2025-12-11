import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedAdmin = localStorage.getItem("adminUser");

    if (savedToken && savedAdmin) {
      try {
        setToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));
        // Set default axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error("Invalid auth data:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        username,
        password,
      });

      const { token: newToken, admin: newAdmin } = response.data;

      localStorage.setItem("adminToken", newToken);
      localStorage.setItem("adminUser", JSON.stringify(newAdmin));

      setToken(newToken);
      setAdmin(newAdmin);

      // Set default axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const register = async (username, email, password, name, registrationKey) => {
    try {
      const response = await axios.post(`${API_URL}/admin/register`, {
        username,
        email,
        password,
        name,
        registrationKey,
      });

      const { token: newToken, admin: newAdmin } = response.data;

      localStorage.setItem("adminToken", newToken);
      localStorage.setItem("adminUser", JSON.stringify(newAdmin));

      setToken(newToken);
      setAdmin(newAdmin);

      // Set default axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, admin, login, register, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
