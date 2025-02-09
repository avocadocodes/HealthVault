import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDetails = () => {
  const { id } = useParams(); 
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    healthIssue: "",
    medicines: "",
    status: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/patients/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatient(response.data);
        setFormData(response.data); 
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch patient details.");
      }
    };

    fetchPatientDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/patients/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPatient(formData); 
      setIsEditing(false); 
      alert("Patient details updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update patient details.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete patient.");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="bg-red-100 text-red-700 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  if (!patient) {
    return <p className="p-6 text-gray-600">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        {isEditing ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
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
                value={formData.healthIssue}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Medicines Diagnosed</label>
              <textarea
                name="medicines"
                value={formData.medicines}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <textarea
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 mr-4"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="mb-2">
              <strong>Name:</strong> {patient.name}
            </p>
            <p className="mb-2">
              <strong>Age:</strong> {patient.age}
            </p>
            <p className="mb-2">
              <strong>Gender:</strong> {patient.gender}
            </p>
            <p className="mb-2">
              <strong>Health Issue:</strong> {patient.healthIssue || "Not provided"}
            </p>
            <p className="mb-2">
              <strong>Medicines Diagnosed:</strong> {patient.medicines || "Not provided"}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {patient.status || "Not provided"}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 mr-4"
            >
              Edit Details
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
              Delete Patient
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
