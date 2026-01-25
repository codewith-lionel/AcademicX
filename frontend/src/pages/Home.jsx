import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaUsers,
  FaBook,
  FaCalendar,
  FaTrophy,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  facultyAPI,
  studyMaterialAPI,
  eventAPI,
  achievementAPI,
} from "../services/api";

gsap.registerPlugin(ScrollTrigger);

const shimmer =
  "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]";

const StatCard = ({ icon, color, title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-xl shadow-md text-center p-6 hover:shadow-xl transition-all"
  >
    <div
      className={`bg-${color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}
    >
      <div className={`text-3xl text-${color}-600`}>{icon}</div>
    </div>
    <div className="text-4xl font-extrabold text-gray-900">{value}</div>
    <div className="text-gray-600 text-sm tracking-wide">{title}</div>
  </motion.div>
);

const Home = () => {
  const [stats, setStats] = useState({
    faculty: 0,
    materials: 0,
    events: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(true);

  const heroRef = useRef();
  const statsRef = useRef();

  // Fetch all data
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [facultyRes, materialsRes, eventsRes, achievementsRes] =
        await Promise.all([
          facultyAPI.getAll(),
          studyMaterialAPI.getAll(),
          eventAPI.getAll(),
          achievementAPI.getAll(),
        ]);

      setStats({
        faculty: facultyRes.data.data?.length || 0,
        materials: materialsRes.data.data?.length || 0,
        events: eventsRes.data.data?.length || 0,
        achievements: achievementsRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load content 😞");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from(heroRef.current, {
          opacity: 0,
          y: -80,
          duration: 1.2,
          ease: "power3.out",
        });

        gsap.utils.toArray(".stat-card").forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
            opacity: 0,
            y: 50,
            delay: i * 0.1,
            duration: 0.8,
            ease: "power2.out",
          });
        });

        gsap.to(".hero-bg", {
          backgroundPosition: "200% center",
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
      return () => ctx.revert();
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section
        ref={heroRef}
        className="relative hero-section text-white py-28 overflow-hidden"
      >
        <div className="absolute inset-0 hero-bg bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-600 bg-[length:400%_400%] transition-all"></div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <FaGraduationCap className="text-7xl mx-auto mb-6 animate-bounce" />
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              School of <span className="text-yellow-300">Computing</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Empowering the next generation of tech innovators through
              creativity, excellence, and AI-powered learning.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/about"
                className="relative group px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-indigo-200 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
                <span className="relative z-10">Learn More</span>
              </Link>
              <Link
                to="/contact"
                className="relative group px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500"></span>
                <span className="relative z-10">Contact Us</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section
        ref={statsRef}
        className="bg-white shadow-xl -mt-16 relative z-20 py-14"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-6 ${shimmer} h-40 w-full`}
                  ></div>
                ))
              : [
                  {
                    icon: <FaUsers />,
                    color: "blue",
                    title: "Faculty Members",
                    value: stats.faculty,
                  },
                  {
                    icon: <FaBook />,
                    color: "green",
                    title: "Study Materials",
                    value: stats.materials,
                  },
                  {
                    icon: <FaCalendar />,
                    color: "purple",
                    title: "Events",
                    value: stats.events,
                  },
                  {
                    icon: <FaTrophy />,
                    color: "yellow",
                    title: "Achievements",
                    value: stats.achievements,
                  },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <StatCard {...s} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER CALL ================= */}

      {/* Custom keyframe for shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};

export default Home;
