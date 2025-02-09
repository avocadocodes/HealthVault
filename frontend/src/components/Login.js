import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import LoginBackground from "../images/login.png";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );
      const { token, user } = response.data;
      onLogin(token, user.role);
      navigate(user.role === "doctor" ? "/dashboard" : "/patient-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
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
              backgroundImage: `url(${LoginBackground})`, 
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
          </div>
        </motion.div>

        {/* Right Box */}
        <motion.div
          className="flex-1 bg-gray-900 text-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <span>Don't have an account? </span>
            <button
              onClick={() => navigate("/register-user")}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
