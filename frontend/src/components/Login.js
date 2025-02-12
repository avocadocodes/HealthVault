import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginBackground from "../images/login.png";

const Login = () => {
  const [step, setStep] = useState("login"); // "login" -> "forgotPassword" -> "resetPassword"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.status !== 200) throw Error("Invalid credentials");
      const { user } = response.data;
      navigate(user.role === "doctor" ? "/dashboard" : "/patient-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  // Handle forgot password request (send OTP)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgotpassword`,
        { email }
      );
      if (response.status !== 200) throw Error("Failed to send OTP");
      setStep("resetPassword");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP.");
    }
  };

  // Handle reset password (OTP + new password)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/resetpassword`,
        { email, enteredOtp:otp, password }
      );
      if (response.status !== 200) throw Error("Reset failed.");
      setStep("login");
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-6">
      <div className="container mx-auto flex items-center space-x-16">
        {/* Left Image Section */}
        <motion.div
          className="flex-1 relative rounded-lg shadow-lg overflow-hidden"
          style={{ height: "500px" }}
          whileHover={{ scale: 1.05, transition: { duration: 0.6 } }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${LoginBackground})` }}></div>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </motion.div>

        {/* Right Form Section */}
        <motion.div className="flex-1 bg-gray-900 text-white p-8 rounded-lg shadow-lg">
          {error && <p className="text-red-600">{error}</p>}

          {/* Login Form */}
          {step === "login" && (
            <>
              <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 rounded-lg mb-4 bg-white text-black border border-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 rounded-lg mb-4 bg-white text-black border border-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-gray-600 py-3 rounded-lg">
                  Login
                </button>
              </form>
              <button
                className="text-customGrayLight mt-4 block text-center"
                onClick={() => setStep("forgotPassword")}
              >
                Forgot Password?
              </button>
            </>
          )}

          {/* Forgot Password Form */}
          {step === "forgotPassword" && (
            <>
              <h2 className="text-3xl font-bold mb-6">Reset Password</h2>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-lg mb-4 bg-white text-black border border-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="w-full bg-gray-600 py-3 rounded-lg">
                  Send OTP
                </button>
              </form>
              <button
                className="text-customGrayLight mt-4 block text-center"
                onClick={() => setStep("login")}
              >
                Back to Login
              </button>
            </>
          )}

          {/* Reset Password Form (OTP + New Password) */}
          {step === "resetPassword" && (
            <>
              <h2 className="text-3xl font-bold mb-6">Reset Password</h2>
              <form onSubmit={handleResetPassword}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 rounded-lg mb-4 bg-white text-black border border-gray-400"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter New Password"
                  className="w-full p-3 rounded-lg mb-4 bg-white text-black border border-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-gray-600 py-3 rounded-lg">
                  Reset Password
                </button>
              </form>
              <button
                className="text-customGrayLight mt-4 block text-center"
                onClick={() => setStep("login")}
              >
                Back to Login
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
