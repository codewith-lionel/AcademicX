import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner,
  FaBook,
  FaChartPie,
  FaExclamationTriangle,
} from "react-icons/fa";
import { attendanceAPI } from "../services/api";
import { toast } from "react-toastify";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [stats, setStats] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await attendanceAPI.getMyAttendance();
      const records = response.data?.attendance || [];
      setAttendanceRecords(records);
      calculateStats(records);
    } catch (error) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records) => {
    const totalClasses = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    const percentage =
      totalClasses > 0 ? ((present + late * 0.5) / totalClasses) * 100 : 0;

    setStats({ totalClasses, present, absent, late, percentage });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <FaCheckCircle className="text-green-600" />;
      case "absent":
        return <FaTimesCircle className="text-red-600" />;
      case "late":
        return <FaClock className="text-orange-600" />;
      case "excused":
        return <FaExclamationTriangle className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700";
      case "absent":
        return "bg-red-100 text-red-700";
      case "late":
        return "bg-orange-100 text-orange-700";
      case "excused":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getAttendanceMessage = (percentage) => {
    if (percentage >= 75) return "Good standing! Keep it up!";
    if (percentage >= 60) return "Warning: Below 75% requirement";
    return "Critical: Attendance too low!";
  };

  const courses = [
    ...new Set(attendanceRecords.map((r) => r.course?.title).filter(Boolean)),
  ];

  const filteredRecords =
    selectedCourse === "all"
      ? attendanceRecords
      : attendanceRecords.filter((r) => r.course?.title === selectedCourse);

  const courseWiseStats = courses.map((courseTitle) => {
    const courseRecords = attendanceRecords.filter(
      (r) => r.course?.title === courseTitle
    );
    const total = courseRecords.length;
    const present = courseRecords.filter((r) => r.status === "present").length;
    const late = courseRecords.filter((r) => r.status === "late").length;
    const percentage = total > 0 ? ((present + late * 0.5) / total) * 100 : 0;

    return {
      course: courseTitle,
      total,
      present,
      percentage: percentage.toFixed(1),
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-2">
            Attendance
          </h1>
          <p className="text-xs md:text-base text-gray-600">
            Track your class attendance records
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6">
          <div className="bg-white rounded-lg p-3 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">
                  Total Classes
                </p>
                <p className="text-xl md:text-3xl font-bold text-gray-800">
                  {stats.totalClasses}
                </p>
              </div>
              <FaCalendarCheck className="text-xl md:text-3xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Present</p>
                <p className="text-xl md:text-3xl font-bold text-green-600">
                  {stats.present}
                </p>
              </div>
              <FaCheckCircle className="text-xl md:text-3xl text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Absent</p>
                <p className="text-xl md:text-3xl font-bold text-red-600">
                  {stats.absent}
                </p>
              </div>
              <FaTimesCircle className="text-xl md:text-3xl text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Late</p>
                <p className="text-xl md:text-3xl font-bold text-orange-600">
                  {stats.late}
                </p>
              </div>
              <FaClock className="text-xl md:text-3xl text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Percentage</p>
                <p
                  className={`text-xl md:text-3xl font-bold ${getAttendanceColor(
                    stats.percentage
                  )}`}
                >
                  {stats.percentage.toFixed(1)}%
                </p>
              </div>
              <FaChartPie className="text-xl md:text-3xl text-purple-600" />
            </div>
          </div>
        </div>

        {/* Attendance Alert */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 md:p-6 rounded-lg border mb-6 ${
            stats.percentage >= 75
              ? "bg-green-50 border-green-200"
              : stats.percentage >= 60
              ? "bg-orange-50 border-orange-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {stats.percentage >= 75 ? (
              <FaCheckCircle className="text-2xl md:text-3xl text-green-600" />
            ) : (
              <FaExclamationTriangle
                className={`text-2xl md:text-3xl ${
                  stats.percentage >= 60 ? "text-orange-600" : "text-red-600"
                }`}
              />
            )}
            <div>
              <p
                className={`font-bold text-sm md:text-lg ${
                  stats.percentage >= 75
                    ? "text-green-800"
                    : stats.percentage >= 60
                    ? "text-orange-800"
                    : "text-red-800"
                }`}
              >
                {getAttendanceMessage(stats.percentage)}
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                Minimum 75% attendance required for exam eligibility
              </p>
            </div>
          </div>
        </motion.div>

        {/* Course-wise Attendance */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">
            Course-wise Attendance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courseWiseStats.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                      {course.course}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {course.present}/{course.total} classes
                    </p>
                  </div>
                  <span
                    className={`font-bold text-lg ${getAttendanceColor(
                      parseFloat(course.percentage)
                    )}`}
                  >
                    {course.percentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      parseFloat(course.percentage) >= 75
                        ? "bg-green-600"
                        : parseFloat(course.percentage) >= 60
                        ? "bg-orange-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Course Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Filter by Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">
              Attendance Records
            </h2>
          </div>

          {/* Mobile stacked layout */}
          <div className="block md:hidden">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border-b"
                >
                  <p className="text-sm text-gray-800 font-semibold">
                    {new Date(record.date).toLocaleDateString()}
                  </p>

                  <p className="text-gray-700 mt-1 flex items-center gap-2">
                    <FaBook className="text-blue-600" /> {record.course?.title}
                  </p>

                  <p className="text-gray-600 text-sm mt-1">
                    Topic: {record.topic || "N/A"}
                  </p>

                  <p className="text-gray-600 text-sm mt-1 capitalize">
                    Session: {record.sessionType}
                  </p>

                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center p-8">
                <FaCalendarCheck className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No attendance records found
                </p>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Topic
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Session Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <motion.tr
                      key={record._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm">
                        {new Date(record.date).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaBook className="text-blue-600" />
                          {record.course?.title}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {record.topic || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm capitalize">
                        {record.sessionType}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No attendance records found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
