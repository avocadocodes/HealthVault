import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignUpBackground from "../images/login.png";
import OTPComponent from "./OTPComponent";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
    specialty: "",
  });
  const [otpScreen, setOtpScreen] = useState(false);
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
      if (response.status === 200) {
        console.log("setting otp")
        setOtpScreen(true);
      } else {
        setError("Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-6">
      
        <div className="container mx-auto flex items-center space-x-16">
          {/* Left Box */}
          <motion.div
            className="flex-1 relative rounded-lg shadow-lg overflow-hidden"
            style={{ height: "500px" }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.6 },
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${SignUpBackground})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </motion.div>
            {
              otpScreen?(
                <OTPComponent/>
              ):
              (
                <motion.div
            className="flex-1 bg-gray-900 text-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Register User</h2>
            {message && <p className="text-green-700 bg-green-100 p-2 rounded-md text-center mb-4">{message}</p>}
            {error && <p className="text-red-600 bg-red-100 p-2 rounded-md text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="mb-4">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              {formData.role === "doctor" && (
                <div className="mb-4">
                  <input
                    type="text"
                    name="specialty"
                    placeholder="Specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              )}
              <button type="submit" className="w-full bg-gray-600 py-3 rounded-lg hover:bg-gray-700 transition">
                Register
              </button>
            </form>
            <div className="text-center mt-4">
              <span>Already have an account? </span>
              <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
                Login
              </button>
            </div>
          </motion.div>
              )
            }
          
        </div>
      
    </div>
  );
};

export default RegisterUser;
