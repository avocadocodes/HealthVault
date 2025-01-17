// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import format from "date-fns/format";
// import parse from "date-fns/parse";
// import startOfWeek from "date-fns/startOfWeek";
// import getDay from "date-fns/getDay";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// const locales = {
//   "en-US": require("date-fns/locale/en-US"),
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const Dashboard = () => {
//   const [patients, setPatients] = useState([]);
//   const [bookingRequests, setBookingRequests] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/");
//   };

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Authentication required. Redirecting to login.");
//           navigate("/login");
//           return;
//         }
  
//         const patientsResponse = await axios.get(
//           `${process.env.REACT_APP_API_URL}/patients`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setPatients(patientsResponse.data);
  
//         const bookingResponse = await axios.get(
//           `${process.env.REACT_APP_API_URL}/booking-requests`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setBookingRequests(bookingResponse.data);
  
//         const calendarResponse = await axios.get(
//           `${process.env.REACT_APP_API_URL}/appointments`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setEvents(
//           calendarResponse.data.map((event) => ({
//             title: `${event.patientName} - ${event.healthIssue}`,
//             start: new Date(event.date + "T" + event.time),
//             end: new Date(event.date + "T" + event.time),
//           }))
//         );
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Failed to fetch dashboard data.");
//       }
//     };
  
//     fetchDashboardData();
//   }, []);
  

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${process.env.REACT_APP_API_URL}/patients/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPatients(patients.filter((patient) => patient._id !== id));
//       toast.success("Patient deleted successfully");
//     } catch (err) {
//       toast.error("Failed to delete patient");
//     }
//   };

//   const handleBookingAction = async (id, action) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${process.env.REACT_APP_API_URL}/booking-requests/${id}/${action}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success(`Booking request ${action}ed successfully!`);
//       setBookingRequests(bookingRequests.filter((req) => req._id !== id));
//     } catch (err) {
//       toast.error("Failed to update booking request.");
//     }
//   };

//   const addCalendarEvent = async () => {
//     const title = prompt("Enter event title:");
//     const date = prompt("Enter date (YYYY-MM-DD):");
//     const time = prompt("Enter time (HH:mm):");
//     if (!title || !date || !time) {
//       toast.error("All fields are required!");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/calendar-events`,
//         { title, date, time },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success(response.data.message);
//       setEvents([
//         ...events,
//         { title, start: new Date(`${date}T${time}`), end: new Date(`${date}T${time}`) },
//       ]);
//     } catch (err) {
//       toast.error("Failed to add event.");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-900 text-white min-h-screen">
//       {/* Dashboard Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <div className="flex space-x-4">
//           <button
//             onClick={() => navigate("/register-patient")}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             Add Patient
//           </button>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
//           {error}
//         </p>
//       )}

//       {/* Patients List */}
//       <motion.div
//         className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-xl font-semibold mb-4">Patients List</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-gray-700 text-gray-300">
//               <tr>
//                 <th className="py-3 px-4">Name</th>
//                 <th className="py-3 px-4">Age</th>
//                 <th className="py-3 px-4">Gender</th>
//                 <th className="py-3 px-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patients.length > 0 ? (
//                 patients.map((patient) => (
//                   <tr
//                     key={patient._id}
//                     className="border-b border-gray-600 hover:bg-gray-700 transition"
//                   >
//                     <td className="py-3 px-4">{patient.name}</td>
//                     <td className="py-3 px-4">{patient.age}</td>
//                     <td className="py-3 px-4">{patient.gender}</td>
//                     <td className="py-3 px-4 flex space-x-2">
//                       <button
//                         onClick={() => navigate(`/patients/${patient._id}/stats`)}
//                         className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
//                       >
//                         Stats
//                       </button>
//                       <button
//                         onClick={() => navigate(`/patients/edit/${patient._id}`)}
//                         className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(patient._id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center py-6 text-gray-400">
//                     No patients found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* Booking Requests */}
//       <motion.div
//         className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2 className="text-xl font-semibold mb-4">Pending Booking Requests</h2>
//         {bookingRequests.length > 0 ? (
//           bookingRequests.map((request) => (
//             <div
//               key={request._id}
//               className="bg-gray-700 p-4 rounded-md flex justify-between items-center mb-3"
//             >
//               <div>
//                 <p>
//                   <span className="font-semibold">Patient:</span>{" "}
//                   {request.patientName}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Health Issue:</span>{" "}
//                   {request.healthIssue}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Date:</span>{" "}
//                   {new Date(request.date).toLocaleDateString()}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Time:</span>{" "}
//                   {request.time}
//                 </p>
//               </div>
//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => handleBookingAction(request._id, "approve")}
//                   className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//                 >
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => handleBookingAction(request._id, "reject")}
//                   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">No pending booking requests.</p>
//         )}
//       </motion.div>

//       {/* Calendar Section */}
//       <motion.div
//         className="bg-gray-800 p-6 rounded-lg shadow-lg"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//       >
//         <h2 className="text-xl font-semibold mb-4">Your Calendar</h2>
//         <button
//           onClick={addCalendarEvent}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
//         >
//           Add Event to Calendar
//         </button>
//         <div>
//           <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 500 }}
//             className="bg-gray-900 text-white"
//           />
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;
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
  const [patients, setPatients] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

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

        const bookingResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/booking-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingRequests(bookingResponse.data);

        const calendarResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(
          calendarResponse.data.map((event) => ({
            title: `${event.patientName} - ${event.healthIssue}`,
            start: new Date(event.date + "T" + event.time),
            end: new Date(event.date + "T" + event.time),
          }))
        );
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);
  const handleViewPatients = () => {
    setShowPatientList(true);
  };

  const handleClosePatientList = () => {
    setShowPatientList(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Welcome, Dr. Marcus 👋</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/register-patient")}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Add Patient
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
          onClick={()=> setShowPatientModal(true)}
        >
          <div>
            <h2 className="text-2xl font-semibold">1.4k</h2>
            <p className="text-gray-400">Total Patients</p>
          </div>
          <div className="text-blue-500 text-4xl">👤</div>
        </motion.div>
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h2 className="text-2xl font-semibold">1.1k</h2>
            <p className="text-gray-400">Consultations</p>
          </div>
          <div className="text-green-500 text-4xl">💬</div>
        </motion.div>
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowAppointments(!showAppointments)}
        >
          <div>
            <h2 className="text-2xl font-semibold">1.8k</h2>
            <p className="text-gray-400">Appointments</p>
          </div>
          <div className="text-red-500 text-4xl">📅</div>
        </motion.div>
      </div>

      {/* Appointments Section */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">Appointments</h2>
        <div className="bg-gray-900 rounded-lg shadow-lg p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {bookingRequests.length > 0 ? (
            bookingRequests.map((request) => (
              <div
                key={request._id}
                className="bg-gray-700 p-4 rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">{request.patientName}</h3>
                  <p className="text-sm text-gray-400">
                    {request.healthIssue}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(request.date).toLocaleDateString()} at {request.time}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded-md">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md">
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending booking requests.</p>
          )}
        </div>
      </motion.div>
      {/* Patients List Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-800 text-white w-3/4 max-w-3xl p-6 rounded-lg shadow-lg relative"
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
                <thead className="bg-gray-700 text-gray-300">
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
   


      {/* Calendar Section */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Your Calendar</h2>
        <div className="bg-gray-900 p-4 rounded-md shadow-md">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
            className="text-white"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
