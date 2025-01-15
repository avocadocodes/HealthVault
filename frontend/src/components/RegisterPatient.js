import React, { useState } from "react";
import axios from "axios";

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    healthIssue: "",
    medicines: "",
    status: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not logged in. Please log in first.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/patients`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Patient registered successfully!");
      setFormData({
        name: "",
        age: "",
        gender: "",
        healthIssue: "",
        medicines: "",
        status: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register patient.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Register Patient</h2>
      {message && <p className="bg-green-100 text-green-700 p-3 rounded-md">{message}</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Age</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Health Issue</label>
          <input
            type="text"
            name="healthIssue"
            placeholder="Health Issue"
            value={formData.healthIssue}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Medicines Diagnosed</label>
          <textarea
            name="medicines"
            placeholder="Medicines (e.g., Medicine A, Medicine B)"
            value={formData.medicines}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Status</label>
          <textarea
            name="status"
            placeholder="Status (e.g., recovering, critical)"
            value={formData.status}
            onChange={handleInputChange}
            required
            rows="2"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-full"
        >
          Register Patient
        </button>
      </form>
    </div>
  );
};

export default RegisterPatient;
