import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaBook,
  FaFilePdf,
  FaDownload,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { studyMaterialAPI } from "../../services/api";

const ManageStudyMaterials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);

  // Filter states
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    year: "",
    semester: "",
    description: "",
    fileUrl: "",
    fileType: "PDF",
    category: "Notes",
    uploadedBy: "Admin",
  });

  const years = ["1st Year", "2nd Year", "3rd Year"];
  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];
  const categories = [
    "Notes",
    "Question Papers",
    "Syllabus",
    "Assignments",
    "Reference Books",
    "Lab Manual",
    "Other",
  ];
  const fileTypes = ["PDF", "DOC", "PPT", "ZIP", "Other"];

  // Common subjects (can be customized)
  const commonSubjects = [
    "Data Structures",
    "Algorithms",
    "Database Management",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Web Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Graphics",
    "Compiler Design",
    "Theory of Computation",
    "Digital Electronics",
    "Microprocessors",
    "Mobile Computing",
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    let filtered = [...materials];

    if (filterYear) {
      filtered = filtered.filter((m) => m.year === filterYear);
    }

    if (filterSemester) {
      filtered = filtered.filter((m) => m.semester === filterSemester);
    }

    if (filterSubject) {
      filtered = filtered.filter((m) =>
        m.subject.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((m) => m.category === filterCategory);
    }

    setFilteredMaterials(filtered);
  }, [materials, filterYear, filterSemester, filterSubject, filterCategory]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await studyMaterialAPI.getAll();

      if (response.data.success && response.data.data) {
        setMaterials(response.data.data);
        setFilteredMaterials(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching study materials:", error);
      toast.error("Failed to load study materials");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterYear("");
    setFilterSemester("");
    setFilterSubject("");
    setFilterCategory("");
  };

  // Convert Google Drive link to direct download link
  const convertGoogleDriveLink = (url) => {
    if (!url) return "";

    url = url.trim();

    // If it's already a direct link, return it
    if (
      url.includes("/uc?export=download") ||
      url.includes("drive.google.com/uc?")
    ) {
      return url;
    }

    // Extract file ID from various Google Drive URL formats
    let fileId = "";

    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const match1 = url.match(/\/file\/d\/([^/]+)/);
    if (match1) {
      fileId = match1[1];
    }

    // Format 2: https://drive.google.com/open?id=FILE_ID
    const match2 = url.match(/[?&]id=([^&]+)/);
    if (match2) {
      fileId = match2[1];
    }

    // If we found an ID, return direct download link
    if (fileId) {
      fileId = fileId.split("?")[0].split("/")[0];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return url;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      year: "",
      semester: "",
      description: "",
      fileUrl: "",
      fileType: "PDF",
      category: "Notes",
      uploadedBy: "Admin",
    });
    setEditMode(false);
    setCurrentMaterial(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (material) => {
    setCurrentMaterial(material);
    setFormData({
      title: material.title || "",
      subject: material.subject || "",
      year: material.year || "",
      semester: material.semester || "",
      description: material.description || "",
      fileUrl: material.fileUrl || "",
      fileType: material.fileType || "PDF",
      category: material.category || "Notes",
      uploadedBy: material.uploadedBy || "Admin",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert Google Drive link before saving
      const materialData = {
        ...formData,
        fileUrl: convertGoogleDriveLink(formData.fileUrl),
      };

      if (editMode && currentMaterial) {
        await studyMaterialAPI.update(currentMaterial._id, materialData);
        toast.success("Study material updated successfully!");
      } else {
        await studyMaterialAPI.create(materialData);
        toast.success("Study material added successfully!");
      }

      await fetchMaterials();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving study material:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save study material";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this study material?")
    ) {
      try {
        await studyMaterialAPI.delete(id);
        toast.success("Study material deleted successfully!");
        await fetchMaterials();
      } catch (error) {
        console.error("Error deleting study material:", error);
        toast.error("Failed to delete study material");
      }
    }
  };

  // Get unique subjects from materials for filter dropdown
  const uniqueSubjects = [...new Set(materials.map((m) => m.subject))].sort();

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
                  Manage Study Materials
                </h1>
                <p className="text-gray-600 mt-1">
                  Total: {filteredMaterials.length}{" "}
                  {filteredMaterials.length === 1 ? "material" : "materials"}
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <FaPlus />
              Add Material
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Semesters</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(filterYear ||
            filterSemester ||
            filterSubject ||
            filterCategory) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">
              No study materials found
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Your First Material
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div
                key={material._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FaFilePdf className="text-6xl text-white" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {material.year}
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {material.semester}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {material.title}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-2">
                    {material.subject}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {material.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {material.fileType}
                    </span>
                  </div>

                  {material.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {material.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <FaDownload /> Download
                    </a>
                    <button
                      onClick={() => handleEdit(material)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-primary-600 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-2xl font-bold">
                {editMode ? "Edit Study Material" : "Add New Study Material"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Data Structures Notes - Unit 1"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    list="subjects-list"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Data Structures"
                  />
                  <datalist id="subjects-list">
                    {commonSubjects.map((subject) => (
                      <option key={subject} value={subject} />
                    ))}
                  </datalist>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
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
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Type
                  </label>
                  <select
                    name="fileType"
                    value={formData.fileType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {fileTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the material..."
                  />
                </div>

                {/* Google Drive Link */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Drive Link *
                  </label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>📌 How to share from Google Drive:</strong>
                      <br />
                      1. Right-click your PDF in Google Drive
                      <br />
                      2. Click "Get link"
                      <br />
                      3. Change to "Anyone with the link"
                      <br />
                      4. Copy and paste the link here
                      <br />
                      <em>
                        The system will automatically convert it to a
                        downloadable link!
                      </em>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {editMode ? "Update Material" : "Add Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudyMaterials;
