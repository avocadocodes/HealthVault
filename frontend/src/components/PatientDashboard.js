import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ name: "", specialty: "" });
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Fetch appointments on load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const appointmentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/appointments/patient`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(appointmentsResponse.data);
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
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
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
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Upcoming Visits</h2>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-gray-700 p-4 rounded-md mb-4"
            >
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {appointment.time}
              </p>
              <p>
              <p>Doctor: {appointment.doctorId?.name || "N/A"}</p>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No upcoming visits scheduled.</p>
        )}
      </motion.div>
    </div>
  );
};

export default PatientDashboard;
