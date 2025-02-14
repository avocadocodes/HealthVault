import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaMoon, FaSun, FaSignOutAlt, FaHome } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import axios from 'axios'
const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Fetch role from cookies
  const role = Cookies.get("role");

  const handleLogout = async() => {
    // Remove token and role cookies
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        { withCredentials: true } 
      );
      
      if(response.status!=200)throw Error("unable to logout at the moment")
      navigate("/login"); // Redirect to login page after logout
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50 px-6 py-4 flex justify-between items-center">
      {/* Dashboard Title */}
      <h2 className="text-lg font-semibold">{role === "doctor" ? "Doctor's Dashboard" : "Patient's Dashboard"}</h2>
      
      {/* Navbar Actions */}
      <div className="flex space-x-4">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700">
          {theme === "light" ? <FaMoon className="text-white" /> : <FaSun className="text-white" />}
        </button>

        {/* Home Button */}
        <button onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-gray-700">
          <FaHome className="text-white" />
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-700">
          <FaSignOutAlt className="text-white" />
        </button>
        {/* Profile Button - Only for Doctors */}
        {role === "doctor" && (
          <button 
            onClick={() => navigate("/doctor-profile")} 
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <FaUser className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
