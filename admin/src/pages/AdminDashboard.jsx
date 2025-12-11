import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaCalendar,
  FaImage,
  FaTrophy,
  FaGraduationCap,
  FaChartLine,
  FaNewspaper,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  facultyAPI,
  studyMaterialAPI,
  eventAPI,
  galleryAPI,
} from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    faculty: 0,
    materials: 0,
    events: 0,
    gallery: 0,
    upcomingEvents: 0,
    featuredGallery: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [facultyRes, materialsRes, eventsRes, galleryRes] =
        await Promise.all([
          facultyAPI.getAll(),
          studyMaterialAPI.getAll(),
          eventAPI.getAll(),
          galleryAPI.getAll(),
        ]);

      // Calculate stats
      const facultyCount = facultyRes.data.data?.length || 0;
      const materialsCount = materialsRes.data.data?.length || 0;
      const eventsCount = eventsRes.data.data?.length || 0;
      const galleryCount = galleryRes.data.data?.length || 0;

      // Calculate upcoming events
      const now = new Date();
      const upcomingEvents =
        eventsRes.data.data?.filter(
          (e) => new Date(e.eventDate) >= now && e.status === "Upcoming"
        ).length || 0;

      // Calculate featured gallery items
      const featuredGallery =
        galleryRes.data.data?.filter((g) => g.isFeatured).length || 0;

      setStats({
        faculty: facultyCount,
        materials: materialsCount,
        events: eventsCount,
        gallery: galleryCount,
        upcomingEvents,
        featuredGallery,
      });

      // Build recent activity
      const activities = [];

      // Add recent faculty
      if (facultyRes.data.data?.length > 0) {
        const recentFaculty = facultyRes.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);
        recentFaculty.forEach((f) => {
          activities.push({
            type: "faculty",
            icon: <FaUsers className="text-blue-600" />,
            title: "New Faculty Added",
            description: f.name,
            time: formatTimeAgo(f.createdAt),
          });
        });
      }

      // Add recent materials
      if (materialsRes.data.data?.length > 0) {
        const recentMaterials = materialsRes.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);
        recentMaterials.forEach((m) => {
          activities.push({
            type: "material",
            icon: <FaBook className="text-green-600" />,
            title: "New Study Material",
            description: m.title,
            time: formatTimeAgo(m.createdAt),
          });
        });
      }

      // Add recent events
      if (eventsRes.data.data?.length > 0) {
        const recentEvents = eventsRes.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);
        recentEvents.forEach((e) => {
          activities.push({
            type: "event",
            icon: <FaCalendar className="text-purple-600" />,
            title: "New Event",
            description: e.title,
            time: formatTimeAgo(e.createdAt),
          });
        });
      }

      // Add recent gallery
      if (galleryRes.data.data?.length > 0) {
        const recentGallery = galleryRes.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);
        recentGallery.forEach((g) => {
          activities.push({
            type: "gallery",
            icon: <FaImage className="text-pink-600" />,
            title: "New Gallery Image",
            description: g.title,
            time: formatTimeAgo(g.createdAt),
          });
        });
      }

      // Sort activities by most recent and take top 8
      activities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      setRecentActivity(activities.slice(0, 8));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const parseTimeAgo = (timeString) => {
    if (timeString === "Just now") return 0;
    const match = timeString.match(/(\d+)/);
    if (!match) return 999999;
    const value = parseInt(match[1]);
    if (timeString.includes("minute")) return value;
    if (timeString.includes("hour")) return value * 60;
    if (timeString.includes("day")) return value * 1440;
    return 999999;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      toast.success("Logged out successfully!");
      window.location.href = "/login";
    }
  };

  const quickActions = [
    {
      title: "Manage Faculty",
      icon: <FaUsers className="text-4xl" />,
      color: "from-blue-500 to-blue-700",
      route: "/faculty",
      count: stats.faculty,
    },
    {
      title: "Study Materials",
      icon: <FaBook className="text-4xl" />,
      color: "from-green-500 to-green-700",
      route: "/materials",
      count: stats.materials,
    },
    {
      title: "Events",
      icon: <FaCalendar className="text-4xl" />,
      color: "from-purple-500 to-purple-700",
      route: "/events",
      count: stats.events,
    },
    {
      title: "Gallery",
      icon: <FaImage className="text-4xl" />,
      color: "from-pink-500 to-pink-700",
      route: "/gallery",
      count: stats.gallery,
    },
    {
      title: "Achievements",
      icon: <FaTrophy className="text-4xl" />,
      color: "from-yellow-500 to-yellow-700",
      route: "/achievements",
      count: 0, // You'll add this when achievements is ready
    },
    {
      title: "Courses",
      icon: <FaGraduationCap className="text-4xl" />,
      color: "from-indigo-500 to-indigo-700",
      route: "/courses",
      count: 0, // You'll add this when courses is ready
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-primary-100">
                Welcome back, codewith-lionel! 👋
              </p>
              <p className="text-primary-200 text-sm mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold shadow-lg"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FaChartLine className="text-2xl text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Faculty */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Total Faculty
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.faculty}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUsers className="text-2xl text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Study Materials */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Study Materials
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.materials}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaBook className="text-2xl text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Total Events */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Total Events</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.events}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        {stats.upcomingEvents} upcoming
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaCalendar className="text-2xl text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Gallery Images
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.gallery}
                      </p>
                      <p className="text-xs text-pink-600 mt-1">
                        {stats.featuredGallery} featured
                      </p>
                    </div>
                    <div className="bg-pink-100 p-3 rounded-full">
                      <FaImage className="text-2xl text-pink-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(action.route)}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                    >
                      <div
                        className={`h-32 bg-gradient-to-br ${action.color} flex items-center justify-center text-white relative`}
                      >
                        {action.icon}
                        {action.count > 0 && (
                          <div className="absolute top-2 right-2 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                            {action.count}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {action.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaNewspaper className="text-xl text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recent Activity
                  </h2>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {recentActivity.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                System Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendar className="text-2xl text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Upcoming Events
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {stats.upcomingEvents}
                  </p>
                  <p className="text-sm text-gray-600">Events scheduled</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaImage className="text-2xl text-pink-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Featured Gallery
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-pink-600 mb-1">
                    {stats.featuredGallery}
                  </p>
                  <p className="text-sm text-gray-600">Featured images</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaBook className="text-2xl text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Study Materials
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {stats.materials}
                  </p>
                  <p className="text-sm text-gray-600">Resources available</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
