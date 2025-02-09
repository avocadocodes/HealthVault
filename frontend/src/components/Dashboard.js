import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import axios from "axios";
import { toast } from "react-toastify";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaSignOutAlt, FaHome  , FaCalendarCheck, FaUser } from "react-icons/fa";
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Dashboard = () => {
  const [doctorName, setDoctorName] = useState("");
  const [patients, setPatients] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    healthIssue: "",
    date: "",
    time: "",
  });
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };
  const [activePage, setActivePage] = useState("/booking-requests");

  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  }, [theme]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  const [reload, setReload] = useState(false);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched Appointments:", response.data);
      // const appointmentsData = response.data.appointments || [];

      // setAppointments(response.data || []);
      const filteredAppointments = response.data.filter(
        (appointment) => appointment.status !== "completed"
      );
  
      setAppointments(filteredAppointments);
      // setTimeout(() => {
      //   console.log("Updated Appointments State:", appointments);
      // }, 1000); 
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };
  useEffect(() => {
    console.log("Re-render triggered, Appointments:", appointments);
    setReload(prev => !prev);
  }, [appointments]);

  const fetchDoctorDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctorName(response.data.name); // Set the doctor's name
    } catch (err) {
      console.error("Failed to fetch doctor details:", err);
      toast.error("Failed to fetch doctor details.");
    }
  };
  useEffect(() => {
    if (activePage === "/appointments") {
      fetchAppointments(); 
    }
  }, [activePage]); 
  useEffect(() => {
    fetchDoctorDetails(); 
  }, []);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication required. Redirecting to login.");
          navigate("/login");
          return;
        }
        
        const patientsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/patients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatients(patientsResponse.data);

        await fetchAppointments();
        const appointmentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/appointments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Appointments:", appointmentsResponse.data);
        setAppointments(appointmentsResponse.data);
        const bookingResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/booking-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Booking Requests:", bookingRequests);
        setBookingRequests(bookingResponse.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);
  const handleAddAppointment = async () => {
    if (
      !newAppointment.patientName ||
      !newAppointment.healthIssue ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      toast.error("All fields are required!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      console.log("Adding appointment:", newAppointment);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments`,
        {
          patientName: newAppointment.patientName,
          healthIssue: newAppointment.healthIssue,
          date: newAppointment.date,
          time: newAppointment.time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data) {
        setAppointments((prev) => [...prev, response.data.appointment]);
        toast.success("Appointment added successfully!");
        setNewAppointment({ patientName: "", healthIssue: "", date: "", time: "" });
      } else {
        throw new Error("Failed to receive response from the server");
      }
    } catch (err) {
      console.error("Failed to add appointment:", err);
      toast.error("Failed to add appointment.");
    }
  };
  
  const handleBookingAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/booking-requests/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (action === "approve") {
        await fetchAppointments(); // Refresh appointments after approval
        console.log("Approved Appointment Data:", response.data);
        if (response.data.appointment) {
          const approvedAppointment = response.data.appointment;
        } else {
          console.error("Error: Approved appointment data missing from response");
        }
      }
      toast.success(`Booking request ${action}ed successfully!`);
      setBookingRequests(bookingRequests.filter((req) => req._id !== id));
    } catch (err) {
      toast.error("Failed to update booking request.");
    }
  };
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      toast.success("Appointment deleted successfully!");
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      toast.error("Failed to delete appointment.");
    }
  };
  const markAsVisited = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/appointments/${appointmentId}/visited`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
  
      toast.success("Appointment marked as visited");
    } catch (err) {
      console.error("Failed to mark appointment as visited:", err);
      toast.error("Failed to mark appointment as visited");
    }
  };
  

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/booking-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingRequests(response.data); 
      } catch (err) {
        console.error("Failed to fetch booking requests:", err);
      }
    };
  
    fetchBookingRequests();
  }, []);
  
  return (
    <div className={`flex h-screen min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      
    {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <div>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              onClick={() => toggleMenu("appointments")}
            >
              <FaCalendarCheck className="inline-block mr-2" /> Appointments
            </button>
            {activeMenu === "appointments" && (
              <div className="pl-6">
                
                <button
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
                  onClick={() => setActivePage("/booking-requests")}
                >
                  Booking Requests
                </button>
                <button
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
                  onClick={() => setActivePage("/add-appointment")}
                >
                  Add Appointment
                </button>
                <button
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
                  onClick={() => {setActivePage("/appointments");
        
                  }}
                >
                  Upcoming Appointments
                </button>
              </div>
            )}
            
          </div>
          <div>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              onClick={() => toggleMenu("patients")}
            >
              <FaUser className="inline-block mr-2" /> Patients
            </button>
            {activeMenu === "patients" && (
              <div className="pl-6">
                <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => navigate("/patient-list")}>Patient List</button>
                <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => navigate("/add-patient")}>Add Patient</button>
              </div>
            )}
          </div>
        </nav>
      </aside>
      {/* Header Section */}
      <div className="flex items-center justify-end pr-64 pl-10 mb-6 fixed w-full top-0 left-64 z-50">
        <div className="flex space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700">
            {theme === "light" ? (
              <FaMoon className="text-black dark:text-white" />
            ) : (
              <FaSun className="text-white dark:text-white" />
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === "light" ? (
              <FaHome  className="text-black dark:text-white" />
            ) : (
              <FaHome  className="text-white dark:text-white" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === "light" ? (
              <FaSignOutAlt className="text-black dark:text-white" />
            ) : (
              <FaSignOutAlt className="text-white dark:text-white" />
            )}
          </button>
        </div>
      </div>
      {/* Dynamic Page Content */}
        <div className="p-6 flex-1 overflow-auto">
          {activePage === "/booking-requests" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Booking Requests</h3>
              {bookingRequests.length > 0 ? (
                bookingRequests.map((request) => (
                  <div
                    key={request._id}
                    className={`${
                      theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"
                    } p-4 rounded-md mb-4 flex justify-between items-center`}
                  >
                    <div>
                      <h4 className="font-semibold">{request.patientName}</h4>
                      <p>Issue: {request.healthIssue}</p>
                      <p>Date: {new Date(request.date).toLocaleDateString()}</p>
                      <p>Time: {request.time}</p>
                    </div>
                    <div className="flex space-x-4">
                      {/* Approve Button */}
                      <button
                        onClick={() => handleBookingAction(request._id, "approve")}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Approve
                      </button>

                      {/* Cancel Button */}
                      <button
                        onClick={() => handleBookingAction(request._id, "cancel")}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No pending booking requests.</p>
              )}
            </div>
          )}
           {activePage === "/add-appointment" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Add New Appointment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={newAppointment.patientName}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, patientName: e.target.value })
                }
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />
              <input
                type="text"
                placeholder="Health Issue"
                value={newAppointment.healthIssue}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, healthIssue: e.target.value })
                }
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, date: e.target.value })
                }
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, time: e.target.value })
                }
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />
              </div>
              <button
                onClick={handleAddAppointment}
                className="bg-blue-500 px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
              >
                Add Appointment
              </button>
            </div>
           )}
          {activePage === "/appointments" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
                {appointments && appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className={`${
                        theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"
                      } p-4 rounded-md mb-4`}
                    >
                      <h4 className="font-semibold">{appointment.patientName}</h4>
                      <p>Issue: {appointment.healthIssue}</p>
                      <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                      <p>Time: {appointment.time}</p>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        onClick={() => markAsVisited(appointment._id)}
                      >
                        Mark as Visited
                      </button>
                      <button
                        className="bg-customMaroon px-4 py-2 mt-2 rounded-md hover:bg-red-600"
                        onClick={() => handleDeleteAppointment(appointment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No Appointments Scheduled.</p>
                )}
                </div>
          )} 
        </div>         
      {/* Overview Cards
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          className={`${theme === "light" ? " bg-gray-300" : "bg-customGray"} p-6 rounded-lg shadow-md flex items-center justify-between`}
          whileHover={{ scale: 1.05 }}
          onClick={()=> setShowPatientModal(true)}
        >
          <div>
            <h2 className="text-2xl font-semibold">1.4k</h2>
            <p className={`${theme === "dark" ? " text-white" : "text-black"}`}>Total Patients</p>
          </div>
          <div className="text-blue-500 text-4xl">👤</div>
        </motion.div>
        <motion.div
          className={`${theme === "light" ? " bg-gray-300" : "bg-customGray"} p-6 rounded-lg shadow-md flex justify-between items-center cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowBookingModal(true)}
        >
          <div>
            <h2 className="text-2xl font-semibold">Pending Requests</h2>
            <p className={`${theme === "dark" ? " text-white" : "text-black"}`}>Booking requests</p>
          </div>
          <div className="text-green-500 text-4xl">💬</div>
        </motion.div>
        <motion.div
          className={`${theme === "light" ? " bg-gray-300" : "bg-customGray"} p-6 rounded-lg shadow-md flex justify-between items-center cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowAppointmentModal(true)}
        >
          <div>
            <h2 className="text-2xl font-semibold">Appointments</h2>
            {/* <p className="text-gray-400">Manually added</p> */}
          {/* </div>
          <div className="text-blue-500 text-4xl">📅</div> */}
      {/* //   </motion.div> */}
      {/* // </div> */} 

      {/* Patients List Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className={`${theme === "dark" ? "bg-customGrayLight text-white" : "bg-gray-300 text-black"} w-3/4 max-w-3xl p-6 rounded-lg shadow-lg relative`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Patients List</h2>
              <button
                onClick={() => setShowPatientModal(false)}
                className="text-red-500 text-lg font-bold hover:text-red-600"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className={`${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} `}>
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Age</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="border-b border-gray-600 hover:bg-gray-700 transition"
                    >
                      <td className="py-3 px-4">{patient.name}</td>
                      <td className="py-3 px-4">{patient.age}</td>
                      <td className="py-3 px-4">{patient.gender}</td>
                      <td className="py-3 px-4 flex space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/patients/${patient._id}/stats`)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          Stats
                        </button>
                        <button
                          onClick={() => handleDelete(patient._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    {/* Appointment Modal */}
    {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className={`${theme === "dark" ? "bg-customGrayLight text-white" : "bg-gray-300 text-black"} w-3/4 max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Appointments</h2>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-red-500 text-lg font-bold hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {/* Add Appointment */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Add New Appointment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={newAppointment.patientName}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, patientName: e.target.value })
                  }
                  className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
                />
                <input
                  type="text"
                  placeholder="Health Issue"
                  value={newAppointment.healthIssue}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, healthIssue: e.target.value })
                  }
                  className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
                />
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, date: e.target.value })
                  }
                  className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
                />
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, time: e.target.value })
                  }
                  className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
                />
              </div>
              <button
                onClick={handleAddAppointment}
                className="bg-blue-500 px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
              >
                Add Appointment
              </button>
            </div>

            {/* Appointment List */}
            <h3 className="text-lg font-semibold mb-4">Appointment List</h3>
            <div>
              
              {appointments.map((appointment) => (
                
                <div
                  key={appointment._id}
                  className={`${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} p-4 rounded-md mb-4`}
                >
                  <h4 className="font-semibold">{appointment.patientName}</h4>
                  <p>Issue: {appointment.healthIssue}</p>
                  <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p>Time: {appointment.time}</p>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={() => markAsVisited(appointment._id)}
                  >
                    Mark as Visited
                  </button>
                  <button
                    className="bg-customMaroon px-4 py-2 mt-2 rounded-md hover:bg-red-600"
                    onClick={() => handleDeleteAppointment(appointment._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Requests Modal */}
      {showBookingModal && (
        <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50`}>
          <motion.div
            className={`${theme === "dark" ? "bg-customGrayLight text-white" : "bg-gray-300 text-black"} w-3/4 max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pending Booking Requests</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-red-500 text-lg font-bold hover:text-red-600"
              >
                ✕
              </button>
            </div>
            {bookingRequests.length > 0 ? (
              bookingRequests.map((request) => (
                <div
                  key={request._id}
                  className={`${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} p-4 rounded-md mb-4 flex justify-between items-center`}
                >
                  <div>
                    <h4 className="font-semibold">{request.patientName}</h4>
                    <p>Issue: {request.healthIssue}</p>
                    <p>Date: {new Date(request.date).toLocaleDateString()}</p>
                    <p>Time: {request.time}</p>
                  </div>
                  <div className="flex space-x-4">
                    {/* Approve Button */}
                    <button
                      onClick={() => handleBookingAction(request._id, "approve")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>



                    {/* Cancel Button */}
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.delete(
                            `${process.env.REACT_APP_API_URL}/booking-requests/${request._id}`,
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          setBookingRequests((prevRequests) =>
                            prevRequests.filter((req) => req._id !== request._id)
                          );
                          toast.success("Booking request canceled.");
                        } catch (err) {
                          console.error("Error canceling booking request:", err);
                          toast.error("Failed to cancel booking request.");
                        }
                      }}
                      
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Cancel
                    </button>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No pending booking requests.</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
