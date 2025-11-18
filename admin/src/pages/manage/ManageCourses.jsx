import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaBook,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    description: "",
    credits: "",
    level: "Undergraduate",
    semester: "Fall 2024",
    instructor: "",
    schedule: "",
    room: "",
    prerequisites: "",
    syllabus: "",
    maxStudents: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/courses`);
      if (response.data.success && response.data.data) {
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      courseCode: "",
      title: "",
      description: "",
      credits: "",
      level: "Undergraduate",
      semester: "Fall 2024",
      instructor: "",
      schedule: "",
      room: "",
      prerequisites: "",
      syllabus: "",
      maxStudents: "",
    });
    setEditMode(false);
    setCurrentCourse(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData({
      courseCode: course.courseCode || "",
      title: course.title || "",
      description: course.description || "",
      credits: course.credits || "",
      level: course.level || "Undergraduate",
      semester: course.semester || "Fall 2024",
      instructor: course.instructor || "",
      schedule: course.schedule || "",
      room: course.room || "",
      prerequisites: course.prerequisites || "",
      syllabus: course.syllabus || "",
      maxStudents: course.maxStudents || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode && currentCourse) {
        await axios.put(`${API_URL}/courses/${currentCourse._id}`, formData);
        toast.success("Course updated successfully!");
      } else {
        await axios.post(`${API_URL}/courses`, formData);
        toast.success("Course added successfully!");
      }

      await fetchCourses();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save course";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${API_URL}/courses/${id}`);
        toast.success("Course deleted successfully!");
        await fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Courses
                </h1>
                <p className="text-gray-600 mt-1">
                  Total: {filteredCourses.length} courses
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <FaPlus />
              Add Course
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <input
            type="text"
            placeholder="Search by course code, title, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">
              {searchTerm
                ? "No courses found matching your search"
                : "No courses yet"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Your First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                      {course.courseCode}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {course.title}
                    </h3>
                  </div>
                  <FaBook className="text-2xl text-primary-600" />
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {course.instructor && (
                    <div className="flex items-center gap-2">
                      <FaUser className="text-primary-600" />
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  {course.schedule && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary-600" />
                      <span>{course.schedule}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {course.credits} Credits
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8">
            <div className="bg-primary-600 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-2xl font-bold">
                {editMode ? "Edit Course" : "Add New Course"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="CS101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits *
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Introduction to Programming"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Course description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Doctoral">Doctoral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester *
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                    <option value="Fall 2025">Fall 2025</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Tech Hall 201"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Mon, Wed, Fri 10:00 AM - 11:00 AM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prerequisites
                  </label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="CS100, MATH101"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  {editMode ? "Update Course" : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
