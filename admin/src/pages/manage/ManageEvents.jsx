import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaLink,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { eventAPI } from "../../services/api";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Filter states
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "Workshop",
    eventDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    organizer: "CS Department",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    registrationLink: "",
    imageUrl: "",
    maxParticipants: "",
    isRegistrationOpen: true,
    isFeatured: false,
    status: "Upcoming",
    tags: "",
  });

  const eventTypes = [
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

  const statusOptions = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (filterType) {
      filtered = filtered.filter((e) => e.eventType === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [events, filterType, filterStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();

      if (response.data.success && response.data.data) {
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterType("");
    setFilterStatus("");
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
      eventType: "Workshop",
      eventDate: "",
      startTime: "",
      endTime: "",
      venue: "",
      organizer: "CS Department",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      registrationLink: "",
      imageUrl: "",
      maxParticipants: "",
      isRegistrationOpen: true,
      isFeatured: false,
      status: "Upcoming",
      tags: "",
    });
    setEditMode(false);
    setCurrentEvent(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      eventType: event.eventType || "Workshop",
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().split("T")[0]
        : "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      venue: event.venue || "",
      organizer: event.organizer || "CS Department",
      contactPerson: event.contactPerson || "",
      contactEmail: event.contactEmail || "",
      contactPhone: event.contactPhone || "",
      registrationLink: event.registrationLink || "",
      imageUrl: event.imageUrl || "",
      maxParticipants: event.maxParticipants || "",
      isRegistrationOpen:
        event.isRegistrationOpen !== undefined
          ? event.isRegistrationOpen
          : true,
      isFeatured: event.isFeatured || false,
      status: event.status || "Upcoming",
      tags: event.tags ? event.tags.join(", ") : "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Process tags
      const eventData = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : undefined,
      };

      if (editMode && currentEvent) {
        await eventAPI.update(currentEvent._id, eventData);
        toast.success("Event updated successfully!");
      } else {
        await eventAPI.create(eventData);
        toast.success("Event added successfully!");
      }

      await fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save event";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventAPI.delete(id);
        toast.success("Event deleted successfully!");
        await fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Ongoing":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
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
                  Manage Events
                </h1>
                <p className="text-gray-600 mt-1">
                  Total: {filteredEvents.length}{" "}
                  {filteredEvents.length === 1 ? "event" : "events"}
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <FaPlus />
              Add Event
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
                Event Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              {(filterType || filterStatus) && (
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

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No events found</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Event Image */}
                <div className="h-40 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center relative">
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
                    <FaCalendar className="text-6xl text-white" />
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center"
                    style={{ display: event.imageUrl ? "none" : "flex" }}
                  >
                    <FaCalendar className="text-6xl text-white" />
                  </div>
                  {event.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {event.eventType}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Date and Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaCalendar className="text-primary-600" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>

                  {event.startTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <FaClock className="text-primary-600" />
                      <span>
                        {event.startTime}{" "}
                        {event.endTime && `- ${event.endTime}`}
                      </span>
                    </div>
                  )}

                  {event.venue && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <FaMapMarkerAlt className="text-primary-600" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
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
                {editMode ? "Edit Event" : "Add New Event"}
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
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., AI Workshop 2025"
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
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe the event..."
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                    placeholder="e.g., Auditorium, Lab 301"
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
                    placeholder="CS Department"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Dr. John Smith"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="contact@example.com"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>

                {/* Registration Link */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Link
                  </label>
                  <input
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://forms.google.com/..."
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image URL (Google Photos/Imgur)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://lh3.googleusercontent.com/..."
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
                    placeholder="AI, Machine Learning, Workshop"
                  />
                </div>

                {/* Checkboxes */}
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isRegistrationOpen"
                      checked={formData.isRegistrationOpen}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">
                      Registration Open
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">
                      Featured Event
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
                  {editMode ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
