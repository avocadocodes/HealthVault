import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor", // Default role
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("User registered successfully!");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-user-container">
      <h2>Register User</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
