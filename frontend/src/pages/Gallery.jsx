import React, { useState, useEffect, useCallback } from "react";
import {
  FaImage,
  FaStar,
  FaHeart,
  FaEye,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCalendar,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { galleryAPI } from "../services/api";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    "All",
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

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getAll();

      if (response.data.success && response.data.data) {
        setImages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...images];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((img) => img.category === selectedCategory);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredImages(filtered);
  }, [images, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const handleImageClick = async (image) => {
    setSelectedImage(image);
    setShowModal(true);

    // Increment view count
    try {
      await galleryAPI.getById(image._id);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  const handleLike = async (imageId) => {
    try {
      await galleryAPI.like(imageId);
      // Refresh images to show updated like count
      await fetchImages();
      toast.success("Image liked!");
    } catch (error) {
      console.error("Error liking image:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hasActiveFilters = selectedCategory !== "All" || searchTerm;

  // Get featured images
  const featuredImages = images.filter((img) => img.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FaImage className="text-6xl mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-xl text-pink-100">
              Capturing moments and memories from CS Department
            </p>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {!loading && featuredImages.length > 0 && (
        <section className="bg-white py-12 border-b-4 border-yellow-400">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <FaStar className="text-3xl text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Images
              </h2>
              <FaStar className="text-3xl text-yellow-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredImages.map((image) => (
                <div
                  key={image._id}
                  onClick={() => handleImageClick(image)}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                    <FaStar /> Featured
                  </div>
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, category, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <FaFilter className="text-gray-500" />

            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-pink-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 font-semibold"
              >
                <FaTimes /> Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {filteredImages.length} of {images.length} images
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading gallery...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No images found
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search term"
                : "No images have been uploaded yet"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image._id}
                className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleImageClick(image)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaEye />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  {/* Category Badge */}
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {image.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1 line-clamp-2">
                    {image.title}
                  </h3>

                  {/* Description */}
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {image.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <FaEye /> {image.views || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaHeart className="text-red-500" /> {image.likes || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Image Modal */}
      {showModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-6xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-white text-gray-900 rounded-full p-3 hover:bg-gray-200 transition-colors z-10 shadow-lg"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="bg-gray-100 flex items-center justify-center p-4 lg:p-8">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Details */}
              <div className="p-6 lg:p-8 overflow-y-auto max-h-[70vh]">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    {selectedImage.category}
                  </span>
                  {selectedImage.isFeatured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold flex items-center gap-1">
                      <FaStar /> Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedImage.title}
                </h2>

                {/* Description */}
                {selectedImage.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="space-y-3 mb-6">
                  {selectedImage.eventDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar className="text-pink-600" />
                      <span>{formatDate(selectedImage.eventDate)}</span>
                    </div>
                  )}

                  {selectedImage.photographer && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCamera className="text-pink-600" />
                      <span>Photo by: {selectedImage.photographer}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaEye className="text-blue-600 text-xl" />
                    <span className="font-semibold">
                      {selectedImage.views || 0} views
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaHeart className="text-red-600 text-xl" />
                    <span className="font-semibold">
                      {selectedImage.likes || 0} likes
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Tags:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Like Button */}
                <button
                  onClick={() => handleLike(selectedImage._id)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
                >
                  <FaHeart /> Like this Image
                </button>

                {/* Upload Date */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Uploaded on {formatDate(selectedImage.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {!loading && images.length > 0 && (
        <section className="bg-gradient-to-r from-pink-600 to-purple-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-2">{images.length}</div>
                <div className="text-pink-100">Total Images</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {new Set(images.map((img) => img.category)).size}
                </div>
                <div className="text-pink-100">Categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {images.filter((img) => img.isFeatured).length}
                </div>
                <div className="text-pink-100">Featured</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {images.reduce((sum, img) => sum + (img.views || 0), 0)}
                </div>
                <div className="text-pink-100">Total Views</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Gallery;
