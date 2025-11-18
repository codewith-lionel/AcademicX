import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Faculty from "./pages/Faculty";
import CoursesCatalog from "./pages/CoursesCatalog";
import StudyMaterials from "./pages/StudyMaterials";
import EventsAnnouncements from "./pages/EventsAnnouncements";
import Gallery from "./pages/Gallery";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/faculty" element={<Faculty />} />
                    <Route path="/academics" element={<CoursesCatalog />} />
                    <Route
                      path="/study-materials"
                      element={<StudyMaterials />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/events" element={<EventsAnnouncements />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/achievements" element={<Achievements />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
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
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
