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
import PatientDetails from "./components/PatientDetails";
import PatientDashboard from "./components/PatientDashboard";
import BookAppointment from "./components/BookAppointment";
import PatientAppointments from "./components/PatientAppointments";

const App = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-user" element={<RegisterUser />} />
        {token && role === "doctor" && <Route path="/dashboard" element={<Dashboard />} />}
        {token && role === "patient" && <Route path="/patient-dashboard" element={<PatientDashboard />} />}
        <Route path="/patients/edit/:id" element={<EditPatient />} />
        <Route path="/patients/:id/stats" element={<PatientDetails />} />
        <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
        <Route path="/patient-appointments" element={<PatientAppointments />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />

      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
