import React from "react";
import './tailwind.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RegisterPatient from "./components/RegisterPatient";
import RegisterUser from "./components/RegisterUser";
import { ToastContainer } from "react-toastify";
import EditPatient from "./components/EditPatient";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/patients/edit/:id" element={<EditPatient />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
