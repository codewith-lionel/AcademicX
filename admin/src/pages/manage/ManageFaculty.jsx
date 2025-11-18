import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaUpload,
  FaTimes,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { facultyAPI } from "../../services/api";

const ManageFaculty = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "Computer Science",
    specialization: "",
    qualification: "",
    experience: "",
    imageUrl: "",
    officeLocation: "",
    officeHours: "",
    researchInterests: "",
    publications: "",
    achievements: "",
  });

  // Convert Google Drive links to direct image links
  const convertGoogleDriveLink = (url) => {
    if (!url) return "";

    // Trim whitespace
    url = url.trim();

    // Check if it's already a direct link
    if (url.includes("drive.google.com/uc?")) {
      return url;
    }

    // Check if it's a Google Drive link
    if (url.includes("drive.google.com")) {
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

      // Format 3: Extract ID from any position
      if (!fileId) {
        const match3 = url.match(/[-\w]{25,}/);
        if (match3) {
          fileId = match3[0];
        }
      }

      // If we found an ID, return direct link
      if (fileId) {
        // Clean the file ID (remove any trailing parameters)
        fileId = fileId.split("?")[0].split("/")[0];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    // If not a Google Drive link, return as is
    return url;
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    const filtered = faculty.filter(
      (f) =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaculty(filtered);
  }, [searchTerm, faculty]);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      console.log("Fetching faculty from database...");
      const response = await facultyAPI.getAll();
      console.log("Faculty data received:", response.data);

      if (response.data.success && response.data.data) {
        setFaculty(response.data.data);
        setFilteredFaculty(response.data.data);
        console.log("Faculty count:", response.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
      toast.error("Failed to load faculty data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle applying URL (convert Google Drive links)
  const handleApplyUrl = () => {
    const convertedUrl = convertGoogleDriveLink(formData.imageUrl);

    console.log("Original URL:", formData.imageUrl);
    console.log("Converted URL:", convertedUrl);

    if (convertedUrl && convertedUrl !== formData.imageUrl) {
      toast.success("Google Drive link converted!");
    }

    setFormData({
      ...formData,
      imageUrl: convertedUrl,
    });
    setImagePreview(convertedUrl);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setUploadingImage(true);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({
          ...formData,
          imageUrl: base64String,
        });
        setUploadingImage(false);
        setShowUrlInput(false);
        toast.success("Image uploaded successfully!");
      };
      reader.onerror = () => {
        toast.error("Failed to upload image");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      imageUrl: "",
    });
    setShowUrlInput(false);
    toast.info("Image removed");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      designation: "",
      department: "Computer Science",
      specialization: "",
      qualification: "",
      experience: "",
      imageUrl: "",
      officeLocation: "",
      officeHours: "",
      researchInterests: "",
      publications: "",
      achievements: "",
    });
    setImagePreview(null);
    setShowUrlInput(false);
    setEditMode(false);
    setCurrentFaculty(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (facultyMember) => {
    setCurrentFaculty(facultyMember);
    setFormData({
      name: facultyMember.name || "",
      email: facultyMember.email || "",
      phone: facultyMember.phone || "",
      designation: facultyMember.designation || "",
      department: facultyMember.department || "Computer Science",
      specialization: facultyMember.specialization || "",
      qualification: facultyMember.qualification || "",
      experience: facultyMember.experience || "",
      imageUrl: facultyMember.imageUrl || "",
      officeLocation: facultyMember.officeLocation || "",
      officeHours: facultyMember.officeHours || "",
      researchInterests: facultyMember.researchInterests || "",
      publications: facultyMember.publications || "",
      achievements: facultyMember.achievements || "",
    });
    setImagePreview(facultyMember.imageUrl || null);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode && currentFaculty) {
        console.log("Updating faculty:", currentFaculty._id);
        const response = await facultyAPI.update(currentFaculty._id, formData);
        console.log("Update response:", response.data);
        toast.success("Faculty member updated successfully!");
      } else {
        console.log("Adding new faculty:", formData);
        const response = await facultyAPI.create(formData);
        console.log("Create response:", response.data);
        toast.success("Faculty member added successfully!");
      }

      await fetchFaculty();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving faculty:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save faculty";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this faculty member?")
    ) {
      try {
        console.log("Deleting faculty:", id);
        await facultyAPI.delete(id);
        toast.success("Faculty member deleted successfully!");
        await fetchFaculty();
      } catch (error) {
        console.error("Error deleting faculty:", error);
        toast.error("Failed to delete faculty");
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
                  Manage Faculty
                </h1>
                <p className="text-gray-600 mt-1">
                  Total: {filteredFaculty.length}{" "}
                  {filteredFaculty.length === 1 ? "member" : "members"}
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <FaPlus />
              Add Faculty
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, designation, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Faculty Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading faculty...</p>
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">
              {searchTerm
                ? "No faculty members found matching your search"
                : "No faculty members yet"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Your First Faculty Member
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
                      <FaUser className="text-5xl text-gray-400" />
                    </div>
                  )}
                  <div
                    className="w-32 h-32 rounded-full border-4 border-white bg-white items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <FaUser className="text-5xl text-gray-400" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-3">
                    {member.designation}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaGraduationCap className="text-primary-600 flex-shrink-0" />
                      <span className="truncate">{member.specialization}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-primary-600 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-primary-600 flex-shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash /> Delete
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
                {editMode ? "Edit Faculty Member" : "Add New Faculty Member"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              {/* Image Upload Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Faculty Photo
                </label>

                {imagePreview ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                      onError={(e) => {
                        console.error("Image failed to load:", imagePreview);
                        toast.error(
                          "Failed to load image. Please check the URL or try uploading again."
                        );
                        e.target.onerror = null;
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        ✅ Image loaded successfully!
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaTimes /> Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {!showUrlInput ? (
                      <>
                        <div className="text-center">
                          <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
                          <label className="cursor-pointer">
                            <span className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
                              <FaUpload />{" "}
                              {uploadingImage ? "Uploading..." : "Upload Photo"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            JPG, PNG or GIF (max 5MB)
                          </p>
                        </div>

                        {/* OR Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                              OR
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setShowUrlInput(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                          >
                            <FaLink /> Use Image URL / Google Drive
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Paste Image URL or Google Drive Link
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowUrlInput(false)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                        <input
                          type="text"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="https://drive.google.com/file/d/..."
                        />
                        <button
                          type="button"
                          onClick={handleApplyUrl}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          ✨ Apply URL
                        </button>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-800">
                            <strong>📌 How to use Google Drive:</strong>
                            <br />
                            1. Upload image to Google Drive
                            <br />
                            2. Right-click → Get link → Set to "Anyone with the
                            link"
                            <br />
                            3. Copy the link and paste above
                            <br />
                            4. Click "Apply URL" to convert it automatically!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Dr. John Smith"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="john.smith@university.edu"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">
                      Associate Professor
                    </option>
                    <option value="Assistant Professor">
                      Assistant Professor
                    </option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Visiting Professor">
                      Visiting Professor
                    </option>
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Artificial Intelligence"
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ph.D. in Computer Science"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="10 years"
                  />
                </div>

                {/* Office Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Location
                  </label>
                  <input
                    type="text"
                    name="officeLocation"
                    value={formData.officeLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Tech Building, Room 301"
                  />
                </div>

                {/* Office Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    value={formData.officeHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Mon-Fri, 2:00 PM - 4:00 PM"
                  />
                </div>

                {/* Research Interests */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Interests
                  </label>
                  <textarea
                    name="researchInterests"
                    value={formData.researchInterests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Machine Learning, Deep Learning, Computer Vision"
                  />
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
                  disabled={uploadingImage}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploadingImage
                    ? "Uploading..."
                    : editMode
                    ? "Update Faculty"
                    : "Add Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaculty;
