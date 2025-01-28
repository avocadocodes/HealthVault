import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { FaHome, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ name: "", specialty: "" });
  // const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  }, [theme]);

  // Fetch appointments on load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/appointments/patient`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { upcomingAppointments, completedAppointments } = result.data;
        setUpcomingAppointments(upcomingAppointments);
        setCompletedAppointments(completedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch doctors based on search query
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/doctors`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: searchQuery, // Send the name and specialty as query params
        }
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Handle form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchDoctors();
  };

  // Update search query state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <div className="flex space-x-4">
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === "light" ? (
              <FaMoon className="text-black dark:text-white" />
            ) : (
              <FaSun className="text-white dark:text-white" />
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === "light" ? (
              <FaHome className="text-black dark:text-white" />
            ) : (
              <FaHome className="text-white dark:text-white" />
            )}
            
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
            }}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === "light" ? (
              <FaSignOutAlt className="text-black dark:text-white" />
            ) : (
              <FaSignOutAlt className="text-white dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Search Doctors */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">Find Doctors</h2>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Search by name..."
            value={searchQuery.name}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="specialty"
            placeholder="Search by specialty..."
            value={searchQuery.specialty}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition"
          >
            Search
          </button>
        </form>
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-gray-700 p-4 rounded-md flex justify-between items-center mb-4"
          >
            <div>
              <h2 className="text-lg font-bold">{doctor.name}</h2>
              <p className="text-gray-400">Specialty: {doctor.specialty}</p>
            </div>
            <button
              onClick={() => navigate(`/book-appointment/${doctor._id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Book Appointment
            </button>
          </div>
        ))}
        {doctors.length === 0 && (
          <p className="text-gray-400">No doctors found matching your search.</p>
        )}
      </motion.div>

      {/* Upcoming Visits */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Upcoming Visits</h2>
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {appointment.time}
              </p>
              <p>
                <span className="font-semibold">Doctor:</span>{" "}
                {appointment.doctorId?.name || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No upcoming visits scheduled.</p>
        )}
      </motion.div>
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
        {completedAppointments.length > 0 ? (
          completedAppointments.map((appointment) => (
            <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {appointment.time}
              </p>
              <p>
                <span className="font-semibold">Doctor:</span>{" "}
                {appointment.doctorId?.name || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No completed appointments yet.</p>
        )}
      </motion.div>

    </div>
  );
};

export default PatientDashboard;
