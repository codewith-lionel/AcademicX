import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUpload,
  FaSpinner,
  FaCalendar,
  FaBook,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { assignmentAPI } from "../services/api";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    textContent: "",
    files: [],
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getMyAssignments();
      setAssignments(response.data?.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId) => {
    try {
      setSubmitting(true);
      await assignmentAPI.submitAssignment(assignmentId, submissionData);
      toast.success("Assignment submitted successfully!");
      setShowSubmitModal(false);
      setSubmissionData({ textContent: "", files: [] });
      fetchAssignments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (assignment) => {
    if (assignment.hasSubmitted) {
      if (assignment.submission?.status === "graded")
        return "bg-green-100 text-green-700";
      if (assignment.submission?.status === "late")
        return "bg-orange-100 text-orange-700";
      return "bg-blue-100 text-blue-700";
    }

    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    if (dueDate < now) return "bg-red-100 text-red-700";
    if (dueDate - now < 24 * 60 * 60 * 1000)
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusText = (assignment) => {
    if (assignment.hasSubmitted) {
      if (assignment.submission?.status === "graded")
        return `Graded (${assignment.submission.marks}/${assignment.maxMarks})`;
      if (assignment.submission?.status === "late") return "Submitted Late";
      return "Submitted";
    }

    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    if (dueDate < now) return "Overdue";
    if (dueDate - now < 24 * 60 * 60 * 1000) return "Due Soon";
    return "Pending";
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "pending") return !assignment.hasSubmitted;
    if (filter === "submitted") return assignment.hasSubmitted;
    if (filter === "graded") return assignment.submission?.status === "graded";
    return true;
  });

  const AssignmentCard = ({ assignment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
      onClick={() => setSelectedAssignment(assignment)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {assignment.title}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaBook className="text-blue-600" />
            {assignment.course?.title}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            assignment
          )}`}
        >
          {getStatusText(assignment)}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {assignment.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-orange-600" />
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <FaClipboardList className="text-purple-600" />
            Max: {assignment.maxMarks} marks
          </span>
        </div>

        {!assignment.hasSubmitted &&
          new Date(assignment.dueDate) > new Date() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAssignment(assignment);
                setShowSubmitModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
            >
              Submit Now
            </button>
          )}
      </div>
    </motion.div>
  );

  const SubmitModal = () => (
    <AnimatePresence>
      {showSubmitModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !submitting && setShowSubmitModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Submit Assignment
              </h2>
              <button
                onClick={() => !submitting && setShowSubmitModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">
                {selectedAssignment?.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedAssignment?.description}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Submission
              </label>
              <textarea
                value={submissionData.textContent}
                onChange={(e) =>
                  setSubmissionData({
                    ...submissionData,
                    textContent: e.target.value,
                  })
                }
                rows="6"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your submission here or attach files..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attach Files (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  File upload feature coming soon
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleSubmit(selectedAssignment._id)}
                disabled={submitting || !submissionData.textContent.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Submit Assignment
                  </>
                )}
              </button>
              <button
                onClick={() => !submitting && setShowSubmitModal(false)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const DetailModal = () => (
    <AnimatePresence>
      {selectedAssignment && !showSubmitModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAssignment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedAssignment.title}
                </h2>
                <p className="text-gray-600">
                  {selectedAssignment.course?.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-bold text-gray-800">
                  {new Date(selectedAssignment.dueDate).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Max Marks</p>
                <p className="font-bold text-gray-800">
                  {selectedAssignment.maxMarks}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedAssignment.description}
              </p>
            </div>

            {selectedAssignment.instructions && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Instructions</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedAssignment.instructions}
                </p>
              </div>
            )}

            {selectedAssignment.hasSubmitted &&
              selectedAssignment.submission && (
                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Your Submission</h3>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Submitted on</p>
                    <p className="font-bold text-gray-800">
                      {new Date(
                        selectedAssignment.submission.submittedAt
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedAssignment.submission.textContent}
                    </p>
                  </div>
                  {selectedAssignment.submission.status === "graded" && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-green-800">Graded</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {selectedAssignment.submission.marks}/
                          {selectedAssignment.maxMarks}
                        </p>
                      </div>
                      {selectedAssignment.submission.feedback && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Feedback:</p>
                          <p className="text-gray-700">
                            {selectedAssignment.submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            {!selectedAssignment.hasSubmitted &&
              new Date(selectedAssignment.dueDate) > new Date() && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Submit Assignment
                </button>
              )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
            Assignments
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            View and submit your course assignments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Total</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                  {assignments.length}
                </p>
              </div>
              <FaClipboardList className="text-2xl md:text-3xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Pending</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-600">
                  {assignments.filter((a) => !a.hasSubmitted).length}
                </p>
              </div>
              <FaExclamationCircle className="text-2xl md:text-3xl text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Submitted</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600">
                  {assignments.filter((a) => a.hasSubmitted).length}
                </p>
              </div>
              <FaCheckCircle className="text-2xl md:text-3xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Graded</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600">
                  {
                    assignments.filter((a) => a.submission?.status === "graded")
                      .length
                  }
                </p>
              </div>
              <FaFileAlt className="text-2xl md:text-3xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
          {["all", "pending", "submitted", "graded"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold transition-colors ${
                filter === filterOption
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Assignments Grid */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No assignments found</p>
            </div>
          )}
        </div>
      </div>

      <DetailModal />
      <SubmitModal />
    </div>
  );
};

export default Assignments;
