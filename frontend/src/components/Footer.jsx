import React from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaArrowUp,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/faculty", label: "Faculty" },
    { path: "/about", label: "About Us" },
    { path: "/events", label: "Events" },
  ];

  const resourceLinks = [
    { path: "/study-materials", label: "Study Materials" },
    { path: "/gallery", label: "Gallery" },
    { path: "/achievements", label: "Achievements" },
    { path: "http://localhost:3001", label: "Admin Panel", external: true },
  ];

  const socialLinks = [
    {
      icon: FaFacebook,
      url: "#",
      color: "hover:text-blue-600",
      label: "Facebook",
    },
    {
      icon: FaTwitter,
      url: "#",
      color: "hover:text-blue-400",
      label: "Twitter",
    },
    {
      icon: FaInstagram,
      url: "#",
      color: "hover:text-pink-600",
      label: "Instagram",
    },
    {
      icon: FaLinkedin,
      url: "#",
      color: "hover:text-blue-700",
      label: "LinkedIn",
    },
    {
      icon: FaYoutube,
      url: "#",
      color: "hover:text-red-600",
      label: "YouTube",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-400 blur-3xl animate-float-random"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${i * 25}%`,
              top: `${i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${10 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all">
                  <FaGraduationCap className="text-3xl text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  CS Department
                </h3>
                <p className="text-xs text-primary-200">
                  Excellence in Education
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Shaping the future of technology through excellence in education
              and research.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center ${social.color} transition-all transform hover:scale-110 hover:-translate-y-1`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  aria-label={social.label}
                >
                  <social.icon className="text-xl relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h4 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-400 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li
                  key={i}
                  className="transform hover:translate-x-2 transition-transform"
                >
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-300 transition-colors flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-primary-400 rounded-full group-hover:scale-150 transition-transform"></span>
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h4 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-400 rounded-full"></span>
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, i) => (
                <li
                  key={i}
                  className="transform hover:translate-x-2 transition-transform"
                >
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-primary-300 transition-colors flex items-center gap-3 group"
                    >
                      <span className="w-2 h-2 bg-primary-400 rounded-full group-hover:scale-150 transition-transform"></span>
                      <span className="group-hover:underline">
                        {link.label}
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-primary-300 transition-colors flex items-center gap-3 group"
                    >
                      <span className="w-2 h-2 bg-primary-400 rounded-full group-hover:scale-150 transition-transform"></span>
                      <span className="group-hover:underline">
                        {link.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <h4 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-400 rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="bg-primary-500/20 p-2 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                  <FaMapMarkerAlt className="text-primary-400 flex-shrink-0" />
                </div>
                <span className="text-gray-300 text-sm leading-relaxed">
                  Nilgiri College Of Arts And Science,
                  <br />
                  Thaloor, 643239
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="bg-primary-500/20 p-2 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                  <FaPhone className="text-primary-400 flex-shrink-0" />
                </div>
                <a
                  href="tel:+15551234567"
                  className="text-gray-300 hover:text-primary-300 transition-colors text-sm"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="bg-primary-500/20 p-2 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                  <FaEnvelope className="text-primary-400 flex-shrink-0" />
                </div>
                <a
                  href="mailto:info@csdept.edu"
                  className="text-gray-300 hover:text-primary-300 transition-colors text-sm"
                >
                  info@csdept.edu
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider with Animation */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-50"></div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm mb-2">
              © {currentYear} Computer Science Department. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Designed and developed with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://codewith-lionel.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 font-bold underline transition-colors flex items-center gap-2 group"
            >
              LIONEL
              <FaGithub className="group-hover:rotate-12 transition-transform" />
            </a>
            <span>2023-2026</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-primary-500 to-primary-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-primary-500/50 transform hover:scale-110 hover:-translate-y-1 transition-all z-50 group"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="text-xl group-hover:animate-bounce" />
      </button>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-random {
          0%,
          100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-30px, 30px);
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-float-random {
          animation: float-random 15s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
