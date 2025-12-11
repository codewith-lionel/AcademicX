import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBook,
  FaUserTie,
  FaClock,
  FaMapMarkerAlt,
  FaCalendar,
  FaSpinner,
  FaCheckCircle,
  FaPlusCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { enrollmentAPI, courseAPI } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Courses = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrolled");
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [enrollments, courses] = await Promise.all([
        enrollmentAPI.getMyEnrollments({ status: "active" }),
        courseAPI.getAllCourses(),
      ]);

      setEnrolledCourses(enrollments.data?.enrollments || []);

      // Filter out already enrolled courses
      const enrolledCourseIds = enrollments.data?.enrollments?.map(
        (e) => e.course._id
      );
      const available = courses.data?.courses?.filter(
        (c) => !enrolledCourseIds.includes(c._id)
      );
      setAvailableCourses(available || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      await enrollmentAPI.enrollCourse({
        courseId,
        semester: user.semester,
        academicYear: "2024-2025",
      });

      toast.success("Successfully enrolled in course!");
      fetchCourses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to enroll in course"
      );
    } finally {
      setEnrolling(null);
    }
  };

  const handleDrop = async (enrollmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to drop this course? This action cannot be undone."
      )
    )
      return;

    try {
      await enrollmentAPI.dropEnrollment(enrollmentId);
      toast.success("Successfully dropped course");
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to drop course");
    }
  };

  const CourseCard = ({ course, enrollment, isEnrolled }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {course.title || course.course?.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {course.courseCode || course.course?.courseCode}
          </p>
        </div>
        {isEnrolled && enrollment?.status && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              enrollment.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {enrollment.status.toUpperCase()}
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {course.description || course.course?.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaUserTie className="mr-2 text-blue-600" />
          <span>{course.instructor || course.course?.instructor || "TBA"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaBook className="mr-2 text-purple-600" />
          <span>{course.credits || course.course?.credits || 3} Credits</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaClock className="mr-2 text-orange-600" />
          <span>{course.schedule || course.course?.schedule || "TBA"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-red-600" />
          <span>{course.room || course.course?.room || "TBA"}</span>
        </div>
      </div>

      {isEnrolled && (
        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-gray-500">Attendance</p>
            <p className="text-lg font-bold text-blue-600">
              {enrollment.attendancePercentage?.toFixed(1) || 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Grade</p>
            <p className="text-lg font-bold text-green-600">
              {enrollment.grade || "-"}
            </p>
          </div>
        </div>
      )}

      {isEnrolled ? (
        <button
          onClick={() => handleDrop(enrollment._id)}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <FaTimesCircle />
          Drop Course
        </button>
      ) : (
        <button
          onClick={() => handleEnroll(course._id)}
          disabled={enrolling === course._id}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {enrolling === course._id ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaPlusCircle />
          )}
          {enrolling === course._id ? "Enrolling..." : "Enroll Now"}
        </button>
      )}
    </motion.div>
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
            My Courses
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage your course enrollments and view course details
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`pb-4 px-4 md:px-6 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === "enrolled"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Enrolled Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-4 px-4 md:px-6 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === "available"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>

        {/* Course Grid */}
        {activeTab === "enrolled" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((enrollment) => (
                <CourseCard
                  key={enrollment._id}
                  course={enrollment.course}
                  enrollment={enrollment}
                  isEnrolled={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  You haven't enrolled in any courses yet
                </p>
                <button
                  onClick={() => setActiveTab("available")}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Browse Available Courses →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {availableCourses.length > 0 ? (
              availableCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaCheckCircle className="text-6xl text-green-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No available courses to enroll in
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
