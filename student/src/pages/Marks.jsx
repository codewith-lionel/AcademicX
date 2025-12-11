import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTrophy,
  FaChartLine,
  FaGraduationCap,
  FaSpinner,
  FaBook,
  FaAward,
  FaDownload,
  FaStar,
} from "react-icons/fa";
import { marksAPI } from "../services/api";
import { toast } from "react-toastify";

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [gpaData, setGpaData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchMarks();
    fetchGPA();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await marksAPI.getMyMarks();
      setMarks(response.data?.marks || []);
    } catch (error) {
      console.error("Error fetching marks:", error);
      toast.error("Failed to load marks");
    } finally {
      setLoading(false);
    }
  };

  const fetchGPA = async () => {
    try {
      const response = await marksAPI.getMyGPA();
      setGpaData(response.data);
    } catch (error) {
      console.error("Error fetching GPA:", error);
    }
  };

  const handleDownloadGradeCard = async (semester) => {
    try {
      toast.info("Grade card download feature coming soon!");
      // In production, this would call: marksAPI.getGradeCard(semester)
    } catch (error) {
      toast.error("Failed to download grade card");
    }
  };

  const getGradeColor = (grade) => {
    if (["A+", "A"].includes(grade)) return "text-green-600 bg-green-100";
    if (["B+", "B"].includes(grade)) return "text-blue-600 bg-blue-100";
    if (["C+", "C"].includes(grade)) return "text-orange-600 bg-orange-100";
    if (grade === "D") return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90)
      return { label: "Excellent", color: "text-green-600" };
    if (percentage >= 75) return { label: "Very Good", color: "text-blue-600" };
    if (percentage >= 60) return { label: "Good", color: "text-orange-600" };
    if (percentage >= 50) return { label: "Average", color: "text-yellow-600" };
    return { label: "Needs Improvement", color: "text-red-600" };
  };

  // Group marks by course and semester
  const courseWiseMarks = marks.reduce((acc, mark) => {
    const key = `${mark.course?._id}-${mark.semester}`;
    if (!acc[key]) {
      acc[key] = {
        course: mark.course,
        semester: mark.semester,
        marks: [],
      };
    }
    acc[key].marks.push(mark);
    return acc;
  }, {});

  const courseStats = Object.values(courseWiseMarks).map((courseData) => {
    const totalMarks = courseData.marks.reduce((sum, m) => sum + m.maxMarks, 0);
    const obtainedMarks = courseData.marks.reduce(
      (sum, m) => sum + m.marksObtained,
      0
    );
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    const grade = courseData.marks[0]?.grade || "N/A";

    return {
      ...courseData,
      totalMarks,
      obtainedMarks,
      percentage: percentage.toFixed(2),
      grade,
    };
  });

  // Filter by semester
  const filteredStats =
    selectedSemester === "all"
      ? courseStats
      : courseStats.filter(
          (stat) => stat.semester.toString() === selectedSemester
        );

  // Get unique semesters
  const semesters = [...new Set(marks.map((m) => m.semester))].sort(
    (a, b) => b - a
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Marks & Performance
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            View your academic performance and grades
          </p>
        </div>

        {/* GPA Stats */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg md:rounded-xl p-6 md:p-8 shadow-xl text-white"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <FaGraduationCap className="text-3xl md:text-5xl opacity-80" />
              <FaTrophy className="text-2xl md:text-3xl opacity-60" />
            </div>
            <p className="text-blue-100 text-xs md:text-sm mb-2">
              Cumulative GPA
            </p>
            <p className="text-3xl md:text-5xl font-bold mb-2">
              {gpaData?.cgpa ? gpaData.cgpa.toFixed(2) : "N/A"}
            </p>
            <p className="text-blue-100 text-sm">Out of 10.0</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-8 shadow-xl text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaChartLine className="text-5xl opacity-80" />
              <FaStar className="text-3xl opacity-60" />
            </div>
            <p className="text-green-100 text-sm mb-2">Current Semester GPA</p>
            <p className="text-5xl font-bold mb-2">
              {gpaData?.currentSemesterGPA
                ? gpaData.currentSemesterGPA.toFixed(2)
                : "N/A"}
            </p>
            <p className="text-green-100 text-sm">Semester Performance</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-8 shadow-xl text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaAward className="text-5xl opacity-80" />
              <FaBook className="text-3xl opacity-60" />
            </div>
            <p className="text-purple-100 text-sm mb-2">Total Courses</p>
            <p className="text-5xl font-bold mb-2">{courseStats.length}</p>
            <p className="text-purple-100 text-sm">Enrolled & Graded</p>
          </motion.div>
        </div>

        {/* Semester-wise Performance */}
        {gpaData?.semesterWise && gpaData.semesterWise.length > 0 && (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
              Semester-wise Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {gpaData.semesterWise.map((sem) => (
                <motion.div
                  key={sem.semester}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">
                      Semester {sem.semester}
                    </h3>
                    <span className="text-2xl font-bold text-blue-600">
                      {sem.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{sem.courses} courses</p>
                    <p>{sem.totalCredits} credits</p>
                  </div>
                  <button
                    onClick={() => handleDownloadGradeCard(sem.semester)}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Grade Card
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Course-wise Performance */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Course-wise Performance
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {filteredStats.length > 0 ? (
              filteredStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedCourse(stat)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {stat.course?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Semester {stat.semester} • {stat.course?.code}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-lg text-lg font-bold ${getGradeColor(
                        stat.grade
                      )}`}
                    >
                      {stat.grade}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Total Marks</span>
                      <span className="font-bold text-gray-800">
                        {stat.obtainedMarks}/{stat.totalMarks}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span
                        className={`font-bold ${
                          getPerformanceLevel(parseFloat(stat.percentage)).color
                        }`}
                      >
                        {stat.percentage}%
                      </span>
                      <span
                        className={`font-semibold ${
                          getPerformanceLevel(parseFloat(stat.percentage)).color
                        }`}
                      >
                        {getPerformanceLevel(parseFloat(stat.percentage)).label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {stat.marks.map((mark) => (
                      <div
                        key={mark._id}
                        className="bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <p className="text-xs text-gray-600 mb-1 capitalize">
                          {mark.examType.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {mark.marksObtained}/{mark.maxMarks}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No marks available</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Marks Table */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Detailed Marks
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Exam Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Semester
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Marks Obtained
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Max Marks
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Percentage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {marks.length > 0 ? (
                  marks
                    .filter(
                      (mark) =>
                        selectedSemester === "all" ||
                        mark.semester.toString() === selectedSemester
                    )
                    .map((mark, index) => (
                      <motion.tr
                        key={mark._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <FaBook className="text-blue-600" />
                            {mark.course?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                          {mark.examType.replace(/([A-Z])/g, " $1").trim()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Semester {mark.semester}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          {mark.marksObtained}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {mark.maxMarks}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          <span
                            className={
                              getPerformanceLevel(parseFloat(mark.percentage))
                                .color
                            }
                          >
                            {mark.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(
                              mark.grade
                            )}`}
                          >
                            {mark.grade}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No marks available
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

export default Marks;
