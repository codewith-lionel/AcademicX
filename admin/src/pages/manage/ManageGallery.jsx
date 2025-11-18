import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaImage,
  FaStar,
  FaEye,
  FaHeart,
  FaFilter,
  FaTimes,
  FaLink,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { galleryAPI } from "../../services/api";

const ManageGallery = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Filter states
  const [filterCategory, setFilterCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "Event",
    eventDate: "",
    photographer: "",
    tags: "",
    isFeatured: false,
  });

  const categories = [
    "Event",
    "Workshop",
    "Competition",
    "Campus Life",
    "Labs",
    "Classroom",
    "Cultural",
    "Sports",
    "Achievements",
    "Faculty",
    "Students",
    "Infrastructure",
    "Other",
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    let filtered = [...images];

    if (filterCategory) {
      filtered = filtered.filter((img) => img.category === filterCategory);
    }

    setFilteredImages(filtered);
  }, [images, filterCategory]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getAll();

      if (response.data.success && response.data.data) {
        setImages(response.data.data);
        setFilteredImages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterCategory("");
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
      imageUrl: "",
      category: "Event",
      eventDate: "",
      photographer: "",
      tags: "",
      isFeatured: false,
    });
    setEditMode(false);
    setCurrentImage(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (image) => {
    setCurrentImage(image);
    setFormData({
      title: image.title || "",
      description: image.description || "",
      imageUrl: image.imageUrl || "",
      category: image.category || "Event",
      eventDate: image.eventDate
        ? new Date(image.eventDate).toISOString().split("T")[0]
        : "",
      photographer: image.photographer || "",
      tags: image.tags ? image.tags.join(", ") : "",
      isFeatured: image.isFeatured || false,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image URL
    if (!formData.imageUrl || !formData.imageUrl.trim()) {
      toast.error("Please provide an image URL");
      return;
    }

    try {
      // Process tags
      const imageData = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        eventDate: formData.eventDate || undefined,
      };

      if (editMode && currentImage) {
        await galleryAPI.update(currentImage._id, imageData);
        toast.success("Gallery image updated successfully!");
      } else {
        await galleryAPI.create(imageData);
        toast.success("Gallery image added successfully!");
      }

      await fetchImages();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving gallery image:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save gallery image";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await galleryAPI.delete(id);
        toast.success("Gallery image deleted successfully!");
        await fetchImages();
      } catch (error) {
        console.error("Error deleting gallery image:", error);
        toast.error("Failed to delete gallery image");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
                  Manage Gallery
                </h1>
                <p className="text-gray-600 mt-1">
                  Total: {filteredImages.length}{" "}
                  {filteredImages.length === 1 ? "image" : "images"}
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <FaPlus />
              Add Image
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
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              {filterCategory && (
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

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No images found</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Your First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {image.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FaStar /> Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                    <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(image)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Category Badge */}
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {image.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1 line-clamp-1">
                    {image.title}
                  </h3>

                  {/* Description */}
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {image.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaEye /> {image.views || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHeart /> {image.likes || 0}
                    </div>
                  </div>

                  {/* Date */}
                  {image.eventDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(image.eventDate)}
                    </p>
                  )}
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
                {editMode ? "Edit Gallery Image" : "Add New Gallery Image"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              {/* Image URL Section */}
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-primary-300">
                <div className="flex items-center gap-2 mb-3">
                  <FaLink className="text-2xl text-primary-600" />
                  <label className="text-lg font-bold text-gray-900">
                    Image URL *
                  </label>
                </div>

                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                  placeholder="https://i.ibb.co/abc123/image.jpg"
                />

                {/* Live Preview */}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">
                      ✅ Preview:
                    </p>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-4 border-primary-500 shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23fee" width="400" height="300"/%3E%3Ctext fill="%23c00" x="50%25" y="50%25" text-anchor="middle" font-size="16"%3E❌ Invalid Image URL%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}

                {/* Instructions */}
                <div className="mt-4 space-y-3">
                  {/* ImgBB */}
                  <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-green-900 font-bold flex items-center gap-2">
                        <FaImage className="text-green-600" />
                        🌟 Method 1: ImgBB (Recommended)
                      </p>
                      <a
                        href="https://imgbb.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                      >
                        Open ImgBB <FaExternalLinkAlt />
                      </a>
                    </div>
                    <ol className="text-xs text-green-800 space-y-1 ml-4 list-decimal">
                      <li>Upload image on ImgBB</li>
                      <li>Click "Get share links"</li>
                      <li>
                        Copy <strong>"Direct link"</strong>
                      </li>
                      <li>Paste above</li>
                    </ol>
                  </div>

                  {/* Imgur */}
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-blue-900 font-bold flex items-center gap-2">
                        <FaImage className="text-blue-600" />
                        📌 Method 2: Imgur
                      </p>
                      <a
                        href="https://imgur.com/upload"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                      >
                        Open Imgur <FaExternalLinkAlt />
                      </a>
                    </div>
                    <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                      <li>Upload image on Imgur</li>
                      <li>Right-click image → Copy image address</li>
                      <li>Paste above</li>
                    </ol>
                  </div>

                  {/* Test Link */}
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3">
                    <p className="text-xs text-yellow-900">
                      💡 <strong>Test URL:</strong>{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            imageUrl: "https://i.imgur.com/5T3TDzP.jpg",
                          })
                        }
                        className="text-yellow-900 underline font-bold hover:text-yellow-700"
                      >
                        Click to use sample image
                      </button>
                    </p>
                  </div>
                </div>
              </div>

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
                    placeholder="e.g., Tech Fest 2025"
                  />
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
                    placeholder="Describe the image..."
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
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Photographer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photographer
                  </label>
                  <input
                    type="text"
                    name="photographer"
                    value={formData.photographer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Photographer name"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="workshop, AI, students"
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
                      Mark as Featured Image
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
                  {editMode ? "Update Image" : "Add Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
