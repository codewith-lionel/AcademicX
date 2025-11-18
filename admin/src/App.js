import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageFaculty from "./pages/manage/ManageFaculty";
import ManageCourses from "./pages/manage/ManageCourses";
import ManageEvents from "./pages/manage/ManageEvents";
import ManageStudyMaterials from "./pages/manage/ManageStudyMaterials";
import ManageGallery from "./pages/manage/ManageGallery";
import ManageAchievements from "./pages/manage/ManageAchievements";
import Settings from "./pages/manage/Settings";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/faculty" element={<ManageFaculty />} />
          <Route path="/courses" element={<ManageCourses />} />
          <Route path="/events" element={<ManageEvents />} />
          <Route path="/materials" element={<ManageStudyMaterials />} />
          <Route path="/gallery" element={<ManageGallery />} />
          <Route path="/achievements" element={<ManageAchievements />} />
          <Route path="/settings" element={<Settings />} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
