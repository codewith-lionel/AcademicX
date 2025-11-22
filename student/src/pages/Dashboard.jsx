import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  enrollmentAPI,
  assignmentAPI,
  attendanceAPI,
  marksAPI,
} from "../services/api";
import {
  FaBook,
  FaClipboardList,
  FaCalendarCheck,
  FaTrophy,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    pendingAssignments: 0,
    attendance: 0,
    cgpa: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For now, use mock data since these APIs aren't built yet
      // TODO: Uncomment when APIs are ready
      // const [courses, assignments, attendance, marks] = await Promise.all([
      //   enrollmentAPI.getEnrolledCourses(),
      //   assignmentAPI.getMyAssignments(),
      //   attendanceAPI.getAttendanceStats(),
      //   marksAPI.getCGPA(),
      // ]);

      setStats({
        enrolledCourses: 5, // Mock data
        pendingAssignments: 3, // Mock data
        attendance: 87.5, // Mock data
        cgpa: 8.5, // Mock data
      });

      // Mock recent activity
      setRecentActivity([
        {
          type: "assignment",
          title: "New assignment posted in Data Structures",
          time: "2 hours ago",
        },
        {
          type: "marks",
          title: "Marks updated for DBMS Mid-term",
          time: "1 day ago",
        },
        {
          type: "announcement",
          title: "Holiday on November 25th",
          time: "2 days ago",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${bgColor} rounded-xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-white text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`${color} bg-white bg-opacity-20 p-4 rounded-full`}>
          <Icon className="text-3xl text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-blue-100">
            Roll Number: {user?.rollNumber} | Semester: {user?.semester} |{" "}
            {user?.department}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FaBook}
            title="Enrolled Courses"
            value={stats.enrolledCourses}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={FaClipboardList}
            title="Pending Assignments"
            value={stats.pendingAssignments}
            color="text-orange-600"
            bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          <StatCard
            icon={FaCalendarCheck}
            title="Attendance"
            value={`${stats.attendance}%`}
            color="text-green-600"
            bgColor="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={FaTrophy}
            title="CGPA"
            value={stats.cgpa.toFixed(2)}
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Recent Activity
              </h2>
              <FaBell className="text-blue-600 text-xl" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaChartLine className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Quick Links
            </h2>
            <div className="space-y-3">
              <a
                href="/courses"
                className="block p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <h3 className="font-semibold">My Courses</h3>
                <p className="text-sm opacity-90">View enrolled courses</p>
              </a>
              <a
                href="/assignments"
                className="block p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                <h3 className="font-semibold">Assignments</h3>
                <p className="text-sm opacity-90">Submit pending work</p>
              </a>
              <a
                href="/attendance"
                className="block p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                <h3 className="font-semibold">Attendance</h3>
                <p className="text-sm opacity-90">Check your records</p>
              </a>
              <a
                href="/marks"
                className="block p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                <h3 className="font-semibold">Marks & Results</h3>
                <p className="text-sm opacity-90">View your grades</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
