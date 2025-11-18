import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaChevronDown,
  FaUserShield,
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // FIXED CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".hamburger")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/faculty", label: "Faculty" },
    { path: "/academics", label: "Courses" },
    {
      label: "Resources",
      dropdown: [
        { path: "/study-materials", label: "Study Materials" },
        { path: "/events", label: "Events" },
      ],
    },
    { path: "/gallery", label: "Gallery" },
    { path: "/achievements", label: "Achievements" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl py-2"
            : "bg-white/90 backdrop-blur-lg shadow-lg py-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 w-12 h-12 rounded-full flex items-center justify-center shadow-xl">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-gray-900">
                  CS Department
                </h1>
                <p className="text-xs text-gray-600">Excellence in Education</p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link, index) =>
                link.dropdown ? (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold ${
                        activeDropdown === link.label
                          ? "bg-primary-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-primary-600"
                      }`}
                    >
                      {link.label}
                      <FaChevronDown
                        className={`text-xs transition-transform ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* DESKTOP DROPDOWN */}
                    <div
                      className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border transform transition-all duration-300 ${
                        activeDropdown === link.label
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
                    >
                      {link.dropdown.map((item, i) => (
                        <Link
                          key={i}
                          to={item.path}
                          className={`block px-6 py-3 font-semibold ${
                            isActive(item.path)
                              ? "bg-primary-600 text-white"
                              : "text-gray-700 hover:text-primary-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={link.path}
                    className={`px-4 py-2.5 rounded-xl font-semibold ${
                      isActive(link.path)
                        ? "bg-primary-600 text-white shadow-lg"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {/* ADMIN BUTTON */}
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg"
              >
                <FaUserShield />
                Admin
              </a>
            </div>

            {/* MOBILE MENU BUTTON  (FIXED) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="lg:hidden hamburger p-2.5 rounded-xl"
            >
              {isOpen ? (
                <FaTimes className="text-2xl text-primary-600" />
              ) : (
                <FaBars className="text-2xl text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU (FIXED) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`lg:hidden mobile-menu overflow-hidden transition-all duration-500 ${
            isOpen
              ? "max-h-screen opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-4"
          }`}
        >
          <div className="px-4 py-6 bg-white/95 backdrop-blur-xl border-t">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) =>
                link.dropdown ? (
                  <div key={index}>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className={`w-full flex items-center justify-between px-5 py-3 rounded-xl font-semibold ${
                        activeDropdown === link.label
                          ? "bg-primary-600 text-white"
                          : "text-gray-700 hover:text-primary-600"
                      }`}
                    >
                      {link.label}
                      <FaChevronDown
                        className={`transition-transform ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* MOBILE DROPDOWN */}
                    <div
                      className={`ml-4 mt-2 space-y-2 overflow-hidden transition-all ${
                        activeDropdown === link.label
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {link.dropdown.map((item, i) => (
                        <Link
                          key={i}
                          to={item.path}
                          className={`block px-5 py-3 rounded-xl font-semibold ${
                            isActive(item.path)
                              ? "bg-primary-600 text-white"
                              : "text-gray-700 hover:text-primary-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={link.path}
                    className={`px-5 py-3 rounded-xl font-semibold ${
                      isActive(link.path)
                        ? "bg-primary-600 text-white"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {/* MOBILE ADMIN BUTTON */}
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl font-bold"
              >
                <FaUserShield />
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
