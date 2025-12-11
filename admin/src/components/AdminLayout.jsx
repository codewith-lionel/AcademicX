import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaCalendar,
  FaFileAlt,
  FaTrophy,
  FaImages,
  FaCog,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    // Force navigation to login page
    window.location.href = "/login";
  };

  const navItems = [
    { path: "/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/faculty", icon: FaUsers, label: "Faculty" },
    { path: "/courses", icon: FaBook, label: "Courses" },
    { path: "/events", icon: FaCalendar, label: "Events & Announcements" },
    { path: "/materials", icon: FaFileAlt, label: "Study Materials" },
    { path: "/achievements", icon: FaTrophy, label: "Achievements" },
    { path: "/gallery", icon: FaImages, label: "Gallery" },
    { path: "/settings", icon: FaCog, label: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                {admin?.name || "Admin"}
              </h2>
              <p className="text-sm text-gray-600">
                {admin?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find((item) => isActive(item.path))?.label ||
                "Admin Panel"}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-orange-500 transition-colors">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
