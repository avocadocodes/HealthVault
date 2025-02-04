import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPatient = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/patients/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData(response.data);
        setLoading(false); // Data has been fetched
      } catch (err) {
        setError("Failed to load patient data.");
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/patients/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update patient.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 bg-red-100 p-3 rounded-md mt-10">
        {error}
      </p>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Edit Patient
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={(e) =>
            setFormData({ ...formData, age: e.target.value })
          }
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Update Patient
        </button>
      </form>
    </div>
  );
};

export default EditPatient;
