import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem("studentToken");
};

// Axios instance with auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ========== ENROLLMENT APIs ==========
export const enrollmentAPI = {
  getAvailableCourses: () => apiClient.get("/courses/available"),
  getEnrolledCourses: () => apiClient.get("/enrollments/my-courses"),
  enrollCourse: (courseId) =>
    apiClient.post("/enrollments/enroll", { courseId }),
  unenrollCourse: (courseId) => apiClient.delete(`/enrollments/${courseId}`),
  getCourseDetails: (courseId) => apiClient.get(`/courses/${courseId}`),
};

// ========== ASSIGNMENT APIs ==========
export const assignmentAPI = {
  getMyAssignments: () => apiClient.get("/assignments/my-assignments"),
  getAssignmentDetails: (id) => apiClient.get(`/assignments/${id}`),
  submitAssignment: (id, formData) =>
    apiClient.post(`/assignments/${id}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getSubmissionStatus: (id) => apiClient.get(`/assignments/${id}/submission`),
};

// ========== ATTENDANCE APIs ==========
export const attendanceAPI = {
  getMyAttendance: () => apiClient.get("/attendance/my-attendance"),
  getAttendanceBySubject: (subjectId) =>
    apiClient.get(`/attendance/subject/${subjectId}`),
  getAttendanceStats: () => apiClient.get("/attendance/stats"),
};

// ========== MARKS APIs ==========
export const marksAPI = {
  getMyMarks: () => apiClient.get("/marks/my-marks"),
  getMarksBySubject: (subjectId) =>
    apiClient.get(`/marks/subject/${subjectId}`),
  getSemesterResults: (semester) =>
    apiClient.get(`/marks/semester/${semester}`),
  getCGPA: () => apiClient.get("/marks/cgpa"),
};

// ========== EXAM APIs ==========
export const examAPI = {
  getExamSchedule: () => apiClient.get("/exams/schedule"),
  getExamResults: () => apiClient.get("/exams/results"),
  downloadHallTicket: (examId) =>
    apiClient.get(`/exams/${examId}/hall-ticket`, {
      responseType: "blob",
    }),
  downloadGradeCard: (semester) =>
    apiClient.get(`/exams/grade-card/${semester}`, {
      responseType: "blob",
    }),
};

// ========== DISCUSSION APIs ==========
export const discussionAPI = {
  getThreads: (params) => apiClient.get("/discussions", { params }),
  createThread: (data) => apiClient.post("/discussions", data),
  getThreadDetails: (id) => apiClient.get(`/discussions/${id}`),
  replyToThread: (id, content) =>
    apiClient.post(`/discussions/${id}/reply`, { content }),
  upvoteThread: (id) => apiClient.post(`/discussions/${id}/upvote`),
  downvoteThread: (id) => apiClient.post(`/discussions/${id}/downvote`),
  searchDiscussions: (query) =>
    apiClient.get("/discussions/search", { params: { q: query } }),
};

// ========== NOTIFICATION APIs ==========
export const notificationAPI = {
  getNotifications: () => apiClient.get("/notifications"),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put("/notifications/read-all"),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
};

// ========== CHAT APIs ==========
export const chatAPI = {
  getChats: () => apiClient.get("/chats"),
  getChatMessages: (chatId) => apiClient.get(`/chats/${chatId}/messages`),
  sendMessage: (chatId, message) =>
    apiClient.post(`/chats/${chatId}/messages`, { message }),
  createChat: (recipientId) => apiClient.post("/chats", { recipientId }),
};

// ========== PROFILE APIs ==========
export const profileAPI = {
  getProfile: () => apiClient.get("/students/profile"),
  updateProfile: (data) => apiClient.put("/students/profile", data),
  updatePassword: (data) => apiClient.put("/students/password", data),
  uploadAvatar: (formData) =>
    apiClient.post("/students/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ========== CALENDAR APIs ==========
export const calendarAPI = {
  getEvents: () => apiClient.get("/calendar/events"),
  exportToGoogleCalendar: (eventId) =>
    apiClient.post(`/calendar/${eventId}/export`),
  downloadICS: (eventId) =>
    apiClient.get(`/calendar/${eventId}/ics`, {
      responseType: "blob",
    }),
};

// ========== SEARCH API ==========
export const searchAPI = {
  globalSearch: (query) => apiClient.get("/search", { params: { q: query } }),
};

export default apiClient;
