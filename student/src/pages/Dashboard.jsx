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
  FaClock,
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
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [courses, assignments, attendance, gpa] = await Promise.all([
        enrollmentAPI.getMyEnrollments(),
        assignmentAPI.getMyAssignments(),
        attendanceAPI.getMyAttendance(),
        marksAPI.getMyGPA(),
      ]);

      const pending = assignments.data?.assignments?.filter(
        (a) => !a.hasSubmitted
      ).length;

      setStats({
        enrolledCourses: courses.data?.count || 0,
        pendingAssignments: pending || 0,
        attendance: attendance.data?.attendancePercentage || 0,
        cgpa: gpa.data?.data?.cgpa || 0,
      });

      const activity = assignments.data?.assignments.slice(0, 3).map((a) => ({
        title: a.title,
        course: a.course?.title,
        date: new Date(a.dueDate).toLocaleDateString(),
      }));

      setRecentActivity(activity || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-md flex items-center justify-between"
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
      </div>

      <div className="bg-blue-100 p-4 rounded-full">
        <Icon className="text-blue-600 text-2xl" />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/60 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back, <span className="font-semibold">{user?.name}</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={FaBook}
          title="Enrolled Courses"
          value={stats.enrolledCourses}
        />
        <StatCard
          icon={FaClipboardList}
          title="Pending Assignments"
          value={stats.pendingAssignments}
        />
        <StatCard
          icon={FaCalendarCheck}
          title="Attendance"
          value={`${stats.attendance}%`}
        />
        <StatCard icon={FaTrophy} title="CGPA" value={stats.cgpa.toFixed(2)} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <FaBell className="text-blue-600 text-xl" />
          </div>

          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:bg-gray-100 transition"
              >
                <div>
                  <p className="text-gray-800 font-semibold">{item.title}</p>
                  <p className="text-gray-500 text-sm">{item.course}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock />
                  <span className="text-sm">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>

          <div className="space-y-3">
            {[
              { path: "/courses", label: "My Courses" },
              { path: "/assignments", label: "Assignments" },
              { path: "/attendance", label: "Attendance" },
              { path: "/marks", label: "Marks & Results" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.path}
                className="block p-4 rounded-xl bg-gray-50 border hover:bg-blue-50 hover:border-blue-500 transition"
              >
                <p className="text-gray-700 font-semibold">{item.label}</p>
                <p className="text-gray-500 text-sm">Open section</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
