// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useTheme } from "../context/ThemeContext";
// import { FaHome, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";

// const PatientDashboard = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [searchQuery, setSearchQuery] = useState({ name: "", specialty: "" });
//   // const [appointments, setAppointments] = useState([]);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [completedAppointments, setCompletedAppointments] = useState([]);
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };
//   useEffect(() => {
//     document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
//   }, [theme]);

//   // Fetch appointments on load
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const result = await axios.get(
//           `${process.env.REACT_APP_API_URL}/appointments/patient`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const { upcomingAppointments, completedAppointments } = result.data;
//         setUpcomingAppointments(upcomingAppointments);
//         setCompletedAppointments(completedAppointments);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   // Fetch doctors based on search query
//   const fetchDoctors = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/users/doctors`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params: searchQuery, // Send the name and specialty as query params
//         }
//       );
//       setDoctors(response.data);
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//     }
//   };

//   // Handle form submission
//   const handleSearchSubmit = async (e) => {
//     e.preventDefault();
//     await fetchDoctors();
//   };

//   // Update search query state
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSearchQuery({ ...searchQuery, [name]: value });
//   };

//   return (
//     <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Patient Dashboard</h1>
//         <div className="flex space-x-4">
//         <button
//             onClick={toggleTheme}
//             className="p-2 rounded-full hover:bg-gray-700"
//           >
//             {theme === "light" ? (
//               <FaMoon className="text-black dark:text-white" />
//             ) : (
//               <FaSun className="text-white dark:text-white" />
//             )}
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="p-2 rounded-full hover:bg-gray-700"
//           >
//             {theme === "light" ? (
//               <FaHome className="text-black dark:text-white" />
//             ) : (
//               <FaHome className="text-white dark:text-white" />
//             )}
            
//           </button>
//           <button
//             onClick={() => {
//               localStorage.removeItem("token");
//               localStorage.removeItem("role");
//               navigate("/");
//             }}
//             className="p-2 rounded-full hover:bg-gray-700"
//           >
//             {theme === "light" ? (
//               <FaSignOutAlt className="text-black dark:text-white" />
//             ) : (
//               <FaSignOutAlt className="text-white dark:text-white" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Search Doctors */}
//       <motion.div
//         className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-xl font-semibold mb-4">Find Doctors</h2>
//         <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <input
//             type="text"
//             name="name"
//             placeholder="Search by name..."
//             value={searchQuery.name}
//             onChange={handleInputChange}
//             className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="text"
//             name="specialty"
//             placeholder="Search by specialty..."
//             value={searchQuery.specialty}
//             onChange={handleInputChange}
//             className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition"
//           >
//             Search
//           </button>
//         </form>
//         {doctors.map((doctor) => (
//           <div
//             key={doctor._id}
//             className="bg-gray-700 p-4 rounded-md flex justify-between items-center mb-4"
//           >
//             <div>
//               <h2 className="text-lg font-bold">{doctor.name}</h2>
//               <p className="text-gray-400">Specialty: {doctor.specialty}</p>
//             </div>
//             <button
//               onClick={() => navigate(`/book-appointment/${doctor._id}`)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//             >
//               Book Appointment
//             </button>
//           </div>
//         ))}
//         {doctors.length === 0 && (
//           <p className="text-gray-400">No doctors found matching your search.</p>
//         )}
//       </motion.div>

//       {/* Upcoming Visits */}
//       <motion.div
//         className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2 className="text-xl font-semibold mb-4">Upcoming Visits</h2>
//         {upcomingAppointments.length > 0 ? (
//           upcomingAppointments.map((appointment) => (
//             <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
//               <p>
//                 <span className="font-semibold">Date:</span>{" "}
//                 {new Date(appointment.date).toLocaleDateString()}
//               </p>
//               <p>
//                 <span className="font-semibold">Time:</span> {appointment.time}
//               </p>
//               <p>
//                 <span className="font-semibold">Doctor:</span>{" "}
//                 {appointment.doctorId?.name || "N/A"}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">No upcoming visits scheduled.</p>
//         )}
//       </motion.div>
//       <motion.div
//         className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
//         {completedAppointments.length > 0 ? (
//           completedAppointments.map((appointment) => (
//             <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
//               <p>
//                 <span className="font-semibold">Date:</span>{" "}
//                 {new Date(appointment.date).toLocaleDateString()}
//               </p>
//               <p>
//                 <span className="font-semibold">Time:</span> {appointment.time}
//               </p>
//               <p>
//                 <span className="font-semibold">Doctor:</span>{" "}
//                 {appointment.doctorId?.name || "N/A"}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">No completed appointments yet.</p>
//         )}
//       </motion.div>

//     </div>
//   );
// };

// export default PatientDashboard;


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

const PatientDashboard = () => {
  const [doctorName, setDoctorName] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ name: "", specialty: "" });
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
  const [activePage, setActivePage] = useState("/request-appointment");

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
  const fetchPatients = async () => {
    try {
      console.log("Fetching patient data..."); // Debugging
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/patients`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched Patients:", response.data);
      if (Array.isArray(response.data)) {
        setPatients(response.data);
      } else {
        console.error("Patients response is not an array!", response.data);
        setPatients([]); // Prevent frontend crash
      }
      // setPatients(response.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };
  
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
    if (activePage === "/patient-list") {
      fetchPatients();
    }
  }, [activePage]);
  
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
        await fetchAppointments(); 
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
  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.gender) {
      toast.error("All fields are required!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      console.log("Adding patient:", newPatient);
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/patients`,
        newPatient,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data) {
        setPatients((prev) => [...prev, response.data.patient]); // Add to state
        toast.success("Patient added successfully!");
        setNewPatient({ name: "", age: "", gender: "Male" }); // Reset form
      } else {
        throw new Error("Failed to receive response from the server");
      }
    } catch (err) {
      console.error("Failed to add patient:", err);
      toast.error("Failed to add patient.");
    }
  };
  const handleUpdatePatient = async () => {
    if (!editingPatient.name || !editingPatient.age || !editingPatient.gender || !editingPatient.issue || !editingPatient.medicines || !editingPatient.status) {
      toast.error("All fields are required!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/patients/${editingPatient._id}`,
        editingPatient,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Updated Patient Response:", response.data); // ✅ Debugging
  
      if (response.data && response.data.patient) {
        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p._id === editingPatient._id ? response.data.patient : p
          )
        );
  
        toast.success("Patient updated successfully!");
        setEditingPatient(null); // ✅ Close edit form
      } else {
        throw new Error("Failed to receive updated patient data");
      }
    } catch (err) {
      console.error("Failed to update patient:", err);
      toast.error("Failed to update patient.");
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
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male", // Default to Male
  });
  const [editingPatient, setEditingPatient] = useState(null);
  const handleEditPatient = (patient) => {
    setEditingPatient(patient); // Set the patient to be edited
  };
  
  const handleDeletePatient = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/patients/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient._id !== patientId)
      );
  
      toast.success("Patient deleted successfully!");
    } catch (err) {
      console.error("Failed to delete patient:", err);
      toast.error("Failed to delete patient.");
    }
  };
  
    // Handle form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchDoctors();
  };

    // Update search query state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
  };

    // Fetch doctors based on search query
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/doctors`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: searchQuery, // Send the name and specialty as query params
        }
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };


    // Fetch appointments on load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/appointments/patient`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { upcomingAppointments, completedAppointments } = result.data;
        setUpcomingAppointments(upcomingAppointments);
        setCompletedAppointments(completedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
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
                  onClick={() => setActivePage("/request-appointment")}
                >
                  Request Appointment
                </button>
                <button
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
                  onClick={() => setActivePage("/completed-appointment")}
                >
                  Completed Appointment
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
          {activePage === "/request-appointment" && (
      <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Find Doctors</h2>
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Search by name..."
          value={searchQuery.name}
          onChange={handleInputChange}
          className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="specialty"
          placeholder="Search by specialty..."
          value={searchQuery.specialty}
          onChange={handleInputChange}
          className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition"
        >
          Search
        </button>
      </form>
      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          className="bg-gray-700 p-4 rounded-md flex justify-between items-center mb-4"
        >
          <div>
            <h2 className="text-lg font-bold">{doctor.name}</h2>
            <p className="text-gray-400">Specialty: {doctor.specialty}</p>
          </div>
          <button
            onClick={() => navigate(`/book-appointment/${doctor._id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Book Appointment
          </button>
        </div>
      ))}
      {doctors.length === 0 && (
        <p className="text-gray-400">No doctors found matching your search.</p>
      )}
    </motion.div>
          )}
           {activePage === "/completed-appointment" && (
            <motion.div
                    className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
                    {completedAppointments.length > 0 ? (
                      completedAppointments.map((appointment) => (
                        <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
                          <p>
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> {appointment.time}
                          </p>
                          <p>
                            <span className="font-semibold">Doctor:</span>{" "}
                            {appointment.doctorId?.name || "N/A"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No completed appointments yet.</p>
                    )}
                  </motion.div>
           )}
          {activePage === "/appointments" && (
              <motion.div
                      className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <h2 className="text-xl font-semibold mb-4">Upcoming Visits</h2>
                      {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appointment) => (
                          <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
                            <p>
                              <span className="font-semibold">Date:</span>{" "}
                              {new Date(appointment.date).toLocaleDateString()}
                            </p>
                            <p>
                              <span className="font-semibold">Time:</span> {appointment.time}
                            </p>
                            <p>
                              <span className="font-semibold">Doctor:</span>{" "}
                              {appointment.doctorId?.name || "N/A"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">No upcoming visits scheduled.</p>
                      )}
                    </motion.div>
          )} 
        </div>         
    </div>
  );
};

export default PatientDashboard;
