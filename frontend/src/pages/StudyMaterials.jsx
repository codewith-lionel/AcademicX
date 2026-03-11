import React, { useState, useEffect, useCallback } from "react";
import {
  FaBook,
  FaFilePdf,
  FaDownload,
  FaSearch,
  FaFilter,
  FaTimes,
  FaFileAlt,
  FaClipboard,
  FaGraduationCap,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { studyMaterialAPI } from "../services/api";

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const years = ["All", "1st Year", "2nd Year", "3rd Year"];
  const semesters = [
    "All",
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];
  const categories = [
    "All",
    "Notes",
    "Question Papers",
    "Syllabus",
    "Assignments",
    "Reference Books",
    "Lab Manual",
    "Other",
  ];

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await studyMaterialAPI.getAll();

      if (response.data.success && response.data.data) {
        // Sort by year, semester, then subject
        const sorted = response.data.data.sort((a, b) => {
          if (a.year !== b.year) return a.year.localeCompare(b.year);
          if (a.semester !== b.semester)
            return a.semester.localeCompare(b.semester);
          return a.subject.localeCompare(b.subject);
        });
        setMaterials(sorted);
        setFilteredMaterials(sorted);
      }
    } catch (error) {
      console.error("Error fetching study materials:", error);
      toast.error("Failed to load study materials");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...materials];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Year filter
    if (selectedYear !== "All") {
      filtered = filtered.filter((m) => m.year === selectedYear);
    }

    // Semester filter
    if (selectedSemester !== "All") {
      filtered = filtered.filter((m) => m.semester === selectedSemester);
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((m) => m.category === selectedCategory);
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedYear, selectedSemester, selectedCategory]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedYear("All");
    setSelectedSemester("All");
    setSelectedCategory("All");
  };

  // Convert Google Drive link to direct download
  const getDownloadLink = (url) => {
    if (!url) return "#";

    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/\/file\/d\/([^/]+)/);
      if (match) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }

    return url;
  };

  // Get icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "PDF":
        return <FaFilePdf className="text-red-500" />;
      case "DOC":
        return <FaFileAlt className="text-blue-500" />;
      case "PPT":
        return <FaClipboard className="text-orange-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  // Group materials by year and semester
  const groupedMaterials = filteredMaterials.reduce((acc, material) => {
    const year = material.year;
    const semester = material.semester;

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][semester]) {
      acc[year][semester] = [];
    }

    acc[year][semester].push(material);

    return acc;
  }, {});

  const hasActiveFilters =
    selectedYear !== "All" ||
    selectedSemester !== "All" ||
    selectedCategory !== "All" ||
    searchTerm;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FaBook className="text-6xl mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Study Materials</h1>
            <p className="text-xl text-primary-100">
              Access comprehensive study materials, notes, and resources for all
              subjects
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, subject, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <FaFilter className="text-gray-500 flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Semester Filter */}
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                >
                  <FaTimes /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredMaterials.length} of {materials.length} materials
          </div>
        </div>
      </section>

      {/* Materials Content */}
      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading study materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No materials found
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search term"
                : "No study materials have been uploaded yet"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Grouped by Year and Semester */}
            {Object.keys(groupedMaterials)
              .sort()
              .map((year) => (
                <div key={year} className="mb-12">
                  {/* Year Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <FaGraduationCap className="text-3xl text-primary-600" />
                    <h2 className="text-3xl font-bold text-gray-900">{year}</h2>
                  </div>

                  {/* Semesters */}
                  {Object.keys(groupedMaterials[year])
                    .sort()
                    .map((semester) => (
                      <div key={semester} className="mb-8">
                        {/* Semester Header */}
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 mb-4 border-l-4 border-primary-600">
                          <h3 className="text-xl font-bold text-primary-900">
                            {semester}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {groupedMaterials[year][semester].length}{" "}
                            {groupedMaterials[year][semester].length === 1
                              ? "material"
                              : "materials"}
                          </p>
                        </div>

                        {/* Materials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedMaterials[year][semester].map((material) => (
                            <div
                              key={material._id}
                              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200"
                            >
                              {/* Card Header */}
                              <div className="h-28 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <div className="text-white text-6xl">
                                  {getFileIcon(material.fileType)}
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-5">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                                    {material.category}
                                  </span>
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                    {material.fileType}
                                  </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                                  {material.title}
                                </h4>

                                {/* Subject */}
                                <p className="text-primary-600 font-semibold mb-3">
                                  {material.subject}
                                </p>

                                {/* Description */}
                                {material.description && (
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {material.description}
                                  </p>
                                )}

                                {/* Metadata */}
                                <div className="text-xs text-gray-500 mb-4">
                                  Uploaded by {material.uploadedBy} •{" "}
                                  {new Date(
                                    material.createdAt,
                                  ).toLocaleDateString()}
                                </div>

                                {/* Download Button */}
                                <a
                                  href={getDownloadLink(material.fileUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                                  onClick={() =>
                                    toast.info("Starting download...")
                                  }
                                >
                                  <FaDownload /> Download {material.fileType}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Quick Stats */}
      {!loading && materials.length > 0 && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {materials.length}
                </div>
                <div className="text-primary-100">Total Materials</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {new Set(materials.map((m) => m.subject)).size}
                </div>
                <div className="text-primary-100">Subjects Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {materials.filter((m) => m.category === "Notes").length}
                </div>
                <div className="text-primary-100">Notes Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {
                    materials.filter((m) => m.category === "Question Papers")
                      .length
                  }
                </div>
                <div className="text-primary-100">Question Papers</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>
                  Use the search bar to quickly find materials by title,
                  subject, or keywords
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>
                  Filter by year, semester, or category to narrow down results
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>
                  Click the download button to get materials directly from
                  Google Drive
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>
                  Materials are organized by year and semester for easy
                  navigation
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>
                  New materials are added regularly - check back often!
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudyMaterials;
