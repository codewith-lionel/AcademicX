import React, { useState, useEffect, useCallback } from "react";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLink,
  FaStar,
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { eventAPI } from "../services/api";

const EventsAnnouncements = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("upcoming");

  const eventTypes = [
    "All",
    "Workshop",
    "Seminar",
    "Conference",
    "Hackathon",
    "Competition",
    "Guest Lecture",
    "Cultural Event",
    "Sports",
    "Technical Event",
    "Announcement",
    "Holiday",
    "Exam",
    "Other",
  ];

  const statusOptions = [
    "All",
    "Upcoming",
    "Ongoing",
    "Completed",
    "Cancelled",
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();

      if (response.data.success && response.data.data) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...events];

    // Tab filter (upcoming, past, all)
    const now = new Date();
    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        (e) => new Date(e.eventDate) >= now && e.status !== "Completed",
      );
    } else if (activeTab === "past") {
      filtered = filtered.filter(
        (e) => new Date(e.eventDate) < now || e.status === "Completed",
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.venue?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (selectedType !== "All") {
      filtered = filtered.filter((e) => e.eventType === selectedType);
    }

    // Status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter((e) => e.status === selectedStatus);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      return activeTab === "past" ? dateB - dateA : dateA - dateB;
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedType, selectedStatus, activeTab]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSelectedStatus("All");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  const hasActiveFilters =
    selectedType !== "All" || selectedStatus !== "All" || searchTerm;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FaCalendar className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Events & Announcements</h1>
            <p className="text-xl text-primary-100">
              Stay updated with the latest happenings in the CS Department
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === "upcoming"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-primary-600"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === "all"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-primary-600"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === "past"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-primary-600"
              }`}
            >
              Past Events
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title, description, or venue..."
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

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <FaFilter className="text-gray-500" />

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search term"
                : activeTab === "upcoming"
                  ? "No upcoming events at the moment. Check back soon!"
                  : "No events available"}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200"
              >
                {/* Event Image */}
                <div className="relative h-56 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <FaCalendar className="text-7xl text-white" />
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center"
                    style={{ display: event.imageUrl ? "none" : "flex" }}
                  >
                    <FaCalendar className="text-7xl text-white" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                      {event.eventType}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        event.status,
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  {event.isFeatured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>

                  {/* Date */}
                  <div className="flex items-start gap-3 mb-3">
                    <FaCalendar className="text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatDate(event.eventDate)}
                      </p>
                      {event.startTime && (
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <FaClock className="text-primary-600" />
                          {event.startTime}{" "}
                          {event.endTime && `- ${event.endTime}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Venue */}
                  {event.venue && (
                    <div className="flex items-center gap-3 mb-3">
                      <FaMapMarkerAlt className="text-primary-600 flex-shrink-0" />
                      <p className="text-gray-700">{event.venue}</p>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">
                          Organized by:
                        </span>{" "}
                        {event.organizer}
                      </p>
                    </div>
                  )}

                  {/* Contact Info */}
                  {(event.contactPerson ||
                    event.contactEmail ||
                    event.contactPhone) && (
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Contact Information:
                      </p>
                      <div className="space-y-2">
                        {event.contactPerson && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaUser className="text-primary-600" />{" "}
                            {event.contactPerson}
                          </p>
                        )}
                        {event.contactEmail && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaEnvelope className="text-primary-600" />
                            <a
                              href={`mailto:${event.contactEmail}`}
                              className="text-primary-600 hover:underline"
                            >
                              {event.contactEmail}
                            </a>
                          </p>
                        )}
                        {event.contactPhone && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaPhone className="text-primary-600" />
                            <a
                              href={`tel:${event.contactPhone}`}
                              className="text-primary-600 hover:underline"
                            >
                              {event.contactPhone}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Registration */}
                  {event.registrationLink &&
                    event.isRegistrationOpen &&
                    isUpcoming(event.eventDate) && (
                      <div className="mt-4">
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg"
                        >
                          <FaLink /> Register Now
                        </a>
                        {event.maxParticipants && (
                          <p className="text-xs text-center text-gray-500 mt-2">
                            Limited to {event.maxParticipants} participants
                          </p>
                        )}
                      </div>
                    )}

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      {!loading && events.length > 0 && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{events.length}</div>
                <div className="text-primary-100">Total Events</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {
                    events.filter(
                      (e) =>
                        new Date(e.eventDate) >= new Date() &&
                        e.status !== "Completed",
                    ).length
                  }
                </div>
                <div className="text-primary-100">Upcoming</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {new Set(events.map((e) => e.eventType)).size}
                </div>
                <div className="text-primary-100">Event Types</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {events.filter((e) => e.isFeatured).length}
                </div>
                <div className="text-primary-100">Featured Events</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default EventsAnnouncements;
