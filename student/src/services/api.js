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

// ========== COURSE APIs ==========
export const courseAPI = {
  getAllCourses: (params) => apiClient.get("/courses", { params }),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
};

// ========== ENROLLMENT APIs ==========
export const enrollmentAPI = {
  enrollCourse: (data) => apiClient.post("/enrollments", data),
  getMyEnrollments: (params) => {
    const studentId = JSON.parse(localStorage.getItem("studentUser"))?.id;
    return apiClient.get(`/enrollments/student/${studentId}`, { params });
  },
  dropEnrollment: (enrollmentId) =>
    apiClient.delete(`/enrollments/${enrollmentId}`),
  getMyGPA: () => {
    const studentId = JSON.parse(localStorage.getItem("studentUser"))?.id;
    return apiClient.get(`/enrollments/student/${studentId}/gpa`);
  },
};

// ========== ASSIGNMENT APIs ==========
export const assignmentAPI = {
  getMyAssignments: (params) =>
    apiClient.get("/assignments/student", { params }),
  getAssignmentById: (id) => apiClient.get(`/assignments/${id}`),
  submitAssignment: (id, data) =>
    apiClient.post(`/assignments/${id}/submit`, data),
};

// ========== ATTENDANCE APIs ==========
export const attendanceAPI = {
  getMyAttendance: (params) => {
    const studentId = JSON.parse(localStorage.getItem("studentUser"))?.id;
    return apiClient.get(`/attendance/student/${studentId}`, { params });
  },
  getMyCourseAttendance: (courseId, params) => {
    const studentId = JSON.parse(localStorage.getItem("studentUser"))?.id;
    return apiClient.get(
      `/attendance/student/${studentId}/course/${courseId}`,
      { params }
    );
  },
};

// ========== MARKS APIs ==========
export const marksAPI = {
  getMyMarks: (params) => {
    const studentId = JSON.parse(localStorage.getItem("studentUser"))?.id;
    return apiClient.get(`/marks/student/${studentId}`, { params });
  },
  getMyGPA: () => {
    const studentId = JSON.parse(localStorage.getItem("studentUser"))?.id;
    return apiClient.get(`/marks/student/${studentId}/gpa`);
  },
  getGradeCard: (semester) => {
    const studentId = JSON.parse(localStorage.getItem("studentUser"))?.id;
    return apiClient.get(`/marks/student/${studentId}/gradecard/${semester}`);
  },
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
