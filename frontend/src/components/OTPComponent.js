import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OTPComponent({name, email, password, role, specialty}) {
  const [otp, setOtp] = useState(""); // OTP Input
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const verifyOTP = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify`,
        { 
          "enteredOtp": otp ,
          name,email,password,role,specialty
        }
      );

      if (response.status != 404) {
        navigate("/login");
      } else {
        alert("Wrong OTP");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-3xl font-bold mb-6 text-center">Enter OTP</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      <button
        className="w-full bg-gray-600 py-3 rounded-lg hover:bg-gray-700 transition mt-4"
        onClick={verifyOTP} 
      >
        Verify OTP
      </button>
    </div>
  );
}

export default OTPComponent;
