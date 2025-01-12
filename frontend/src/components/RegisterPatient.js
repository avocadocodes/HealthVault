import React, { useState } from "react";
import axios from "axios";

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
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
      console.error("No token found in localStorage");
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
      setFormData({ name: "", age: "", gender: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to register patient.");
    }
  };
  
  return (
    <div className="register-patient-container">
      <h2>Register Patient</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Register Patient</button>
      </form>
    </div>
  );
};

export default RegisterPatient;
