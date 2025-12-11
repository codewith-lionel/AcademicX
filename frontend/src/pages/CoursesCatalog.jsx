import React from "react";
import { Link } from "react-router-dom";
import {
  FaLaptopCode,
  FaShieldAlt,
  FaRobot,
  FaChevronRight,
} from "react-icons/fa";

const courses = [
  {
    code: "BSC-CS",
    title: "B.Sc Computer Science",
    icon: <FaLaptopCode className="text-4xl text-blue-600 mb-2" />,
    description:
      "A foundational undergraduate program focusing on programming, algorithms, operating systems, networks, databases, and software development.",
    details: "3 years | 6 semesters | Full-time",
    route: "/courses/bsc-computer-science",
  },
  {
    code: "BSC-CYBER",
    title: "B.Sc Cybersecurity",
    icon: <FaShieldAlt className="text-4xl text-purple-600 mb-2" />,
    description:
      "A specialized degree addressing cybersecurity, ethical hacking, digital forensics, cryptography, and network security.",
    details: "3 years | 6 semesters | Full-time",
    route: "/courses/bsc-cybersecurity",
  },
  {
    code: "BCA-AI-ROBOTICS",
    title: "BCA with AI & Robotics",
    icon: <FaRobot className="text-4xl text-green-600 mb-2" />,
    description:
      "An advanced BCA program integrating AI, machine learning, robotics, automation, and intelligent systems with core computer applications.",
    details: "3 years | 6 semesters | Full-time",
    route: "/courses/bca-ai-robotics",
  },
];

const CourseCatalog = () => (
  <div className="min-h-screen bg-gray-50">
    <section className="py-16  text-indigo-700">
      <div className="container mx-auto px-4 text-center ">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg ">Courses Catalog</h1>
        <p className="text-xl mb-8  drop-shadow-lg ">
          Explore our major undergraduate programs in Computer Science,
          Cybersecurity, AI, and Robotics.
        </p>
      </div>
    </section>

    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course) => (
            <div
              key={course.code}
              className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all p-8 flex flex-col items-center text-center"
            >
              {course.icon}
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-3">{course.description}</p>
              <p className="text-sm text-gray-500 mb-4">{course.details}</p>
              <Link
                to={course.route}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View Details <FaChevronRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default CourseCatalog;
