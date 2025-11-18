import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaTrophy,
  FaStar,
  FaFilter,
  FaTimes,
  FaMedal,
  FaAward,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { achievementAPI } from "../../services/api";

const ManageAchievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  // Filter states
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic",
    achievedBy: "",
    achieverType: "Student",
    date: "",
    year: "",
    semester: "",
    organizer: "",
    venue: "",
    position: "",
    prize: "",
    imageUrl: "",
    certificateUrl: "",
    proofUrl: "",
    tags: "",
    isFeatured: false,
  });

  const categories = [
    "Academic",
    "Research",
    "Sports",
    "Cultural",
    "Technical",
    "Competition",
    "Award",
    "Publication",
    "Project",
    "Hackathon",
    "Certification",
    "Innovation",
    "Other",
  ];

  const achieverTypes = ["Student", "Faculty", "Team", "Department"];

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    let filtered = [...achievements];

    if (filterCategory) {
      filtered = filtered.filter((a) => a.category === filterCategory);
    }

    if (filterType) {
      filtered = filtered.filter((a) => a.achieverType === filterType);
    }

    setFilteredAchievements(filtered);
  }, [achievements, filterCategory, filterType]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementAPI.getAll();

      if (response.data.success && response.data.data) {
        setAchievements(response.data.data);
        setFilteredAchievements(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterCategory("");
    setFilterType("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Academic",
      achievedBy: "",
      achieverType: "Student",
      date: "",
      year: "",
      semester: "",
      organizer: "",
      venue: "",
      position: "",
      prize: "",
      imageUrl: "",
      certificateUrl: "",
      proofUrl: "",
      tags: "",
      isFeatured: false,
    });
    setEditMode(false);
    setCurrentAchievement(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (achievement) => {
    setCurrentAchievement(achievement);
    setFormData({
      title: achievement.title || "",
      description: achievement.description || "",
      category: achievement.category || "Academic",
      achievedBy: achievement.achievedBy || "",
      achieverType: achievement.achieverType || "Student",
      date: achievement.date
        ? new Date(achievement.date).toISOString().split("T")[0]
        : "",
      year: achievement.year || "",
      semester: achievement.semester || "",
      organizer: achievement.organizer || "",
      venue: achievement.venue || "",
      position: achievement.position || "",
      prize: achievement.prize || "",
      imageUrl: achievement.imageUrl || "",
      certificateUrl: achievement.certificateUrl || "",
      proofUrl: achievement.proofUrl || "",
      tags: achievement.tags ? achievement.tags.join(", ") : "",
      isFeatured: achievement.isFeatured || false,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const achievementData = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };

      if (editMode && currentAchievement) {
        await achievementAPI.update(currentAchievement._id, achievementData);
        toast.success("Achievement updated successfully!");
      } else {
        await achievementAPI.create(achievementData);
        toast.success("Achievement added successfully!");
      }

      await fetchAchievements();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving achievement:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save achievement";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        await achievementAPI.delete(id);
        toast.success("Achievement deleted successfully!");
        await fetchAchievements();
      } catch (error) {
        console.error("Error deleting achievement:", error);
        toast.error("Failed to delete achievement");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Academic: "🎓",
      Research: "🔬",
      Sports: "⚽",
      Cultural: "🎭",
      Technical: "💻",
      Competition: "🏆",
      Award: "🏅",
      Publication: "📚",
      Project: "🚀",
      Hackathon: "⌨️",
      Certification: "📜",
      Innovation: "💡",
    };
    return icons[category] || "🏆";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: "from-blue-500 to-blue-700",
      Research: "from-purple-500 to-purple-700",
      Sports: "from-green-500 to-green-700",
      Cultural: "from-pink-500 to-pink-700",
      Technical: "from-indigo-500 to-indigo-700",
      Competition: "from-yellow-500 to-yellow-700",
      Award: "from-orange-500 to-orange-700",
      Publication: "from-teal-500 to-teal-700",
      Project: "from-cyan-500 to-cyan-700",
      Hackathon: "from-red-500 to-red-700",
      Certification: "from-emerald-500 to-emerald-700",
      Innovation: "from-violet-500 to-violet-700",
    };
    return colors[category] || "from-gray-500 to-gray-700";
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
                  Manage Achievements
                </h1>
                <p className="text-gray-600 mt-1">
                  Total: {filteredAchievements.length}{" "}
                  {filteredAchievements.length === 1
                    ? "achievement"
                    : "achievements"}
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <FaPlus />
              Add Achievement
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {getCategoryIcon(cat)} {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achiever Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {achieverTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              {(filterCategory || filterType) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
                >
                  <FaTimes /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No achievements found</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Your First Achievement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Image - Full Display */}
                <div
                  className={`h-48 bg-gradient-to-br ${getCategoryColor(
                    achievement.category
                  )} flex items-center justify-center relative p-4`}
                >
                  {achievement.imageUrl ? (
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="text-6xl text-white">
                      {getCategoryIcon(achievement.category)}
                    </div>
                  )}
                  {/* Fallback emoji if image fails */}
                  <div
                    className="text-6xl text-white items-center justify-center absolute inset-0"
                    style={{ display: achievement.imageUrl ? "none" : "flex" }}
                  >
                    {getCategoryIcon(achievement.category)}
                  </div>

                  {achievement.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-10 shadow-lg">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-semibold">
                      {achievement.category}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {achievement.achieverType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {achievement.title}
                  </h3>

                  {/* Achiever */}
                  <div className="flex items-center gap-2 text-primary-600 font-semibold mb-2">
                    <FaMedal />
                    <span className="text-sm">{achievement.achievedBy}</span>
                  </div>

                  {/* Date & Position */}
                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    <p>{formatDate(achievement.date)}</p>
                    {achievement.position && (
                      <p className="flex items-center gap-1">
                        <FaAward className="text-yellow-500" />
                        <span className="font-semibold">
                          {achievement.position}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {achievement.description}
                  </p>

                  {/* Links */}
                  {(achievement.certificateUrl || achievement.proofUrl) && (
                    <div className="flex gap-2 mb-4">
                      {achievement.certificateUrl && (
                        <a
                          href={achievement.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          Certificate <FaExternalLinkAlt />
                        </a>
                      )}
                      {achievement.proofUrl && (
                        <a
                          href={achievement.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 text-green-600 hover:underline"
                        >
                          Proof <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(achievement._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
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
                {editMode ? "Edit Achievement" : "Add New Achievement"}
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
                    Achievement Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., First Prize in National Hackathon"
                  />
                </div>

                {/* Description */}
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
                    placeholder="Describe the achievement..."
                  />
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
                        {getCategoryIcon(cat)} {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Achiever Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achiever Type *
                  </label>
                  <select
                    name="achieverType"
                    value={formData.achieverType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {achieverTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Achieved By */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achieved By *
                  </label>
                  <input
                    type="text"
                    name="achievedBy"
                    value={formData.achievedBy}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., John Doe or Team Alpha"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position/Rank
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 1st Place, Winner, Gold Medal"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 2024-2025"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Semester 5"
                  />
                </div>

                {/* Organizer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., IEEE, ACM"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Mumbai, IIT Delhi"
                  />
                </div>

                {/* Prize */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prize/Recognition
                  </label>
                  <input
                    type="text"
                    name="prize"
                    value={formData.prize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., ₹50,000, Trophy & Certificate"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (ImgBB/Imgur)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://i.ibb.co/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload to{" "}
                    <a
                      href="https://imgbb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      ImgBB
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://imgur.com/upload"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Imgur
                    </a>{" "}
                    and paste the direct link
                  </p>
                </div>

                {/* Certificate URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate URL
                  </label>
                  <input
                    type="text"
                    name="certificateUrl"
                    value={formData.certificateUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Link to certificate"
                  />
                </div>

                {/* Proof URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof/Document URL
                  </label>
                  <input
                    type="text"
                    name="proofUrl"
                    value={formData.proofUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Link to proof document"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="hackathon, AI, winner"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Featured Achievement
                    </span>
                  </label>
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
                  {editMode ? "Update Achievement" : "Add Achievement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAchievements;
