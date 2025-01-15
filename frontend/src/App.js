// import React from "react";
// import './tailwind.css';
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Home from "./components/Home";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
// import RegisterPatient from "./components/RegisterPatient";
// import RegisterUser from "./components/RegisterUser";
// import { ToastContainer } from "react-toastify";
// import EditPatient from "./components/EditPatient";
// import PatientDetails from "./components/PatientDetails";
// import PatientDashboard from "./components/PatientDashboard";
// import BookAppointment from "./components/BookAppointment";
// import PatientAppointments from "./components/PatientAppointments";

// const App = () => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   console.log("Token:", token, "Role:", role);


//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register-patient" element={<RegisterPatient />} />
//         <Route path="/register-user" element={<RegisterUser />} />
//         {token && role === "doctor" && (
//           <Route path="/dashboard" element={<Dashboard />} />
//         )}
//         {token && role === "patient" && (
//           <Route path="/patient-dashboard" element={<PatientDashboard />} />
//         )}
        
//         <Route path="/patients/edit/:id" element={<EditPatient />} />
//         <Route path="/patients/:id/stats" element={<PatientDetails />} />
//         <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
//         <Route path="/patient-appointments" element={<PatientAppointments />} />
//       </Routes>
//       <ToastContainer />
//     </Router>
//   );
// };

// export default App;
import React, { useEffect, useState } from "react";
import './tailwind.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogin = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  useEffect(() => {
    console.log("Token:", token, "Role:", role);
  }, [token, role]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-user" element={<RegisterUser />} />

        {/* Protected Routes for Doctors */}
        {token && role === "doctor" ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          <Route path="/dashboard" element={<Navigate to="/login" />} />
        )}

        {/* Protected Routes for Patients */}
        {token && role === "patient" ? (
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
        ) : (
          <Route path="/patient-dashboard" element={<Navigate to="/login" />} />
        )}

        {/* Additional Routes */}
        <Route path="/patients/edit/:id" element={<EditPatient />} />
        <Route path="/patients/:id/stats" element={<PatientDetails />} />
        <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
        <Route path="/patient-appointments" element={<PatientAppointments />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
