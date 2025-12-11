import React, { useState, useEffect } from "react";
import {
  FaTrophy,
  FaStar,
  FaMedal,
  FaAward,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaFilter,
  FaTimes,
  FaExternalLinkAlt,
  FaCertificate,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { achievementAPI } from "../services/api";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    "All",
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

  const achieverTypes = ["All", "Student", "Faculty", "Team", "Department"];

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [achievements, searchTerm, selectedCategory, selectedType, selectedYear]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementAPI.getAll();

      if (response.data.success && response.data.data) {
        setAchievements(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...achievements];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.achievedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== "All") {
      filtered = filtered.filter((a) => a.achieverType === selectedType);
    }

    // Year filter
    if (selectedYear !== "All") {
      filtered = filtered.filter((a) => a.year === selectedYear);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredAchievements(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedYear("All");
  };

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedType !== "All" ||
    selectedYear !== "All" ||
    searchTerm;

  // Get featured achievements
  const featuredAchievements = achievements
    .filter((a) => a.isFeatured)
    .slice(0, 6);

  // Get unique years
  const years = [
    "All",
    ...new Set(achievements.map((a) => a.year).filter(Boolean)),
  ]
    .sort()
    .reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className=" text-indigo-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FaTrophy className="text-6xl mx-auto mb-4 animate-bounce" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 tracking-tight drop-shadow-md mb-4">
              Our Achievements
            </h1>
            <p className="text-xl text-yellow-100">
              Celebrating excellence and success of CS Department
            </p>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {!loading && featuredAchievements.length > 0 && (
        <section className="bg-gradient-to-b from-yellow-50 to-white py-12 border-b-4 border-yellow-400">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <FaStar className="text-3xl text-yellow-500 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Achievements
              </h2>
              <FaStar className="text-3xl text-yellow-500 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredAchievements.map((achievement) => (
                <div
                  key={achievement._id}
                  onClick={() => handleAchievementClick(achievement)}
                  className="relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div
                    className={`h-48 bg-gradient-to-br ${getCategoryColor(
                      achievement.category
                    )} flex items-center justify-center relative p-4`}
                  >
                    {achievement.imageUrl ? (
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.title}
                        className="max-w-full max-h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div className="text-7xl text-white">
                        {getCategoryIcon(achievement.category)}
                      </div>
                    )}
                    {/* Fallback emoji if image fails */}
                    <div
                      className="text-7xl text-white items-center justify-center absolute inset-0"
                      style={{
                        display: achievement.imageUrl ? "none" : "flex",
                      }}
                    >
                      {getCategoryIcon(achievement.category)}
                    </div>

                    {achievement.isFeatured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 shadow-lg">
                        <FaStar /> Featured
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {achievement.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                      <FaMedal />
                      <span>{achievement.achievedBy}</span>
                    </div>
                    {achievement.position && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-orange-600 font-bold">
                        <FaAward />
                        <span>{achievement.position}</span>
                      </div>
                    )}
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
                placeholder="Search by title, achiever, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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

          {/* Filters */}
          <div className="flex items-center gap-2 justify-center flex-wrap mb-4">
            <FaFilter className="text-gray-500" />

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All"
                    ? "All Categories"
                    : `${getCategoryIcon(cat)} ${cat}`}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
            >
              {achieverTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year === "All" ? "All Years" : year}
                </option>
              ))}
            </select>

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
          <div className="text-center text-sm text-gray-600">
            Showing {filteredAchievements.length} of {achievements.length}{" "}
            achievements
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading achievements...</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-20">
            <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search term"
                : "No achievements have been added yet"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement._id}
                className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleAchievementClick(achievement)}
              >
                {/* Image - Full Display */}
                <div
                  className={`h-56 bg-gradient-to-br ${getCategoryColor(
                    achievement.category
                  )} flex items-center justify-center relative p-4`}
                >
                  {achievement.imageUrl ? (
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      className="max-w-full max-h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="text-7xl text-white">
                      {getCategoryIcon(achievement.category)}
                    </div>
                  )}
                  {/* Fallback emoji if image fails */}
                  <div
                    className="text-7xl text-white items-center justify-center absolute inset-0"
                    style={{ display: achievement.imageUrl ? "none" : "flex" }}
                  >
                    {getCategoryIcon(achievement.category)}
                  </div>

                  {achievement.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>

                <div className="p-4">
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
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {achievement.title}
                  </h3>

                  {/* Achiever */}
                  <div className="flex items-center gap-2 text-primary-600 font-semibold mb-2">
                    <FaMedal />
                    <span className="text-sm line-clamp-1">
                      {achievement.achievedBy}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaCalendar className="text-yellow-600" />
                    <span>{formatDate(achievement.date)}</span>
                  </div>

                  {/* Position */}
                  {achievement.position && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 font-bold">
                      <FaAward />
                      <span>{achievement.position}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Achievement Detail Modal - FULL SIZE */}
      {showModal && selectedAchievement && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-7xl w-full h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-white text-gray-900 rounded-full p-3 hover:bg-gray-200 transition-colors z-20 shadow-lg"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left Side - FULL IMAGE */}
              <div
                className={`bg-gradient-to-br ${getCategoryColor(
                  selectedAchievement.category
                )} flex items-center justify-center p-8 relative`}
              >
                {selectedAchievement.imageUrl ? (
                  <img
                    src={selectedAchievement.imageUrl}
                    alt={selectedAchievement.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : (
                  <div className="text-9xl text-white">
                    {getCategoryIcon(selectedAchievement.category)}
                  </div>
                )}
                {/* Fallback */}
                <div
                  className="text-9xl text-white items-center justify-center absolute inset-0"
                  style={{
                    display: selectedAchievement.imageUrl ? "none" : "flex",
                  }}
                >
                  {getCategoryIcon(selectedAchievement.category)}
                </div>

                {selectedAchievement.isFeatured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                    <FaStar /> Featured Achievement
                  </div>
                )}
              </div>

              {/* Right Side - Details (Scrollable) */}
              <div className="p-8 overflow-y-auto bg-white">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span
                    className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(
                      selectedAchievement.category
                    )} text-white rounded-full text-sm font-bold`}
                  >
                    {getCategoryIcon(selectedAchievement.category)}{" "}
                    {selectedAchievement.category}
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {selectedAchievement.achieverType}
                  </span>
                  {selectedAchievement.position && (
                    <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold flex items-center gap-1">
                      <FaAward /> {selectedAchievement.position}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedAchievement.title}
                </h2>

                {/* Achiever */}
                <div className="flex items-center gap-3 mb-6 text-primary-600">
                  <FaMedal className="text-3xl" />
                  <div>
                    <p className="text-sm text-gray-600">Achieved by</p>
                    <p className="text-xl font-bold">
                      {selectedAchievement.achievedBy}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {selectedAchievement.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <FaCalendar className="text-yellow-600 text-xl mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Date
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedAchievement.date)}
                      </p>
                    </div>
                  </div>

                  {selectedAchievement.organizer && (
                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <FaUsers className="text-blue-600 text-xl mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          Organizer
                        </p>
                        <p className="text-gray-900">
                          {selectedAchievement.organizer}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAchievement.venue && (
                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <FaMapMarkerAlt className="text-red-600 text-xl mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          Venue
                        </p>
                        <p className="text-gray-900">
                          {selectedAchievement.venue}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAchievement.prize && (
                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <FaTrophy className="text-yellow-600 text-xl mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          Prize
                        </p>
                        <p className="text-gray-900">
                          {selectedAchievement.prize}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAchievement.year && (
                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <FaCalendar className="text-green-600 text-xl mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          Academic Year
                        </p>
                        <p className="text-gray-900">
                          {selectedAchievement.year}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAchievement.semester && (
                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <FaCalendar className="text-purple-600 text-xl mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          Semester
                        </p>
                        <p className="text-gray-900">
                          {selectedAchievement.semester}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedAchievement.tags &&
                  selectedAchievement.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Tags:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAchievement.tags.map((tag, index) => (
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

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {selectedAchievement.certificateUrl && (
                    <a
                      href={selectedAchievement.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <FaCertificate /> View Certificate
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  )}
                  {selectedAchievement.proofUrl && (
                    <a
                      href={selectedAchievement.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <FaExternalLinkAlt /> View Proof
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {!loading && achievements.length > 0 && (
        <section className=" bg-gradient-to-r from-blue-100 to-blue-50 text-indigo-700 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {achievements.length}
                </div>
                <div className="text-gray-700">Total Achievements</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {new Set(achievements.map((a) => a.category)).size}
                </div>
                <div className="text-gray-700">Categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {achievements.filter((a) => a.isFeatured).length}
                </div>
                <div className="text-gray-700">Featured</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {new Set(achievements.map((a) => a.achievedBy)).size}
                </div>
                <div className="text-gray-700">Achievers</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Achievements;
