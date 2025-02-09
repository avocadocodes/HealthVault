import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookAppointment = () => {
  const { doctorId } = useParams(); 
  const [formData, setFormData] = useState({
    patientName: "",
    healthIssue: "",
    date: "",
    time: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/booking-requests`,
        { ...formData, doctorId }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Booking request sent successfully!");
      setTimeout(() => navigate("/patient-dashboard"), 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to book appointment.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Health Issue</label>
          <textarea
            name="healthIssue"
            value={formData.healthIssue}
            onChange={handleInputChange}
            rows="3"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Request Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
