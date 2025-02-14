// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/authContext";
// import { dateFnsLocalizer } from "react-big-calendar";
// import format from "date-fns/format";
// import parse from "date-fns/parse";
// import startOfWeek from "date-fns/startOfWeek";
// import getDay from "date-fns/getDay";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useTheme } from "../context/ThemeContext";
// import { FaMoon, FaSun, FaSignOutAlt, FaHome  , FaCalendarCheck } from "react-icons/fa";

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

// const PatientDashboard = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [completedAppointments, setCompletedAppointments] = useState([]);
//   const [searchQuery, setSearchQuery] = useState({ name: "", specialty: "" });
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [activePage, setActivePage] = useState("/request-appointment");

//   const toggleMenu = (menu) => {
//     setActiveMenu(activeMenu === menu ? null : menu);
//   };
//   const { theme, toggleTheme } = useTheme();
//   useEffect(() => {
//     document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
//   }, [theme]);

//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/appointments`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Fetched Appointments:", response.data);
//       const filteredAppointments = response.data.filter(
//         (appointment) => appointment.status !== "completed"
//       );
  
//       setAppointments(filteredAppointments);
//     } catch (err) {
//       console.error("Failed to fetch appointments:", err);
//     }
//   };
 
//   useEffect(() => {
//     if (activePage === "/appointments") {
//       fetchAppointments(); 
//     }
//   }, [activePage]); 

//   const handleSearchSubmit = async (e) => {
//     e.preventDefault();
//     await fetchDoctors();
//   };
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSearchQuery({ ...searchQuery, [name]: value });
//   };
//   const fetchDoctors = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/users/doctors`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params: searchQuery, 
//         }
//       );
//       setDoctors(response.data);
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//     }
//   };

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

//   return (
//     <div className={`flex h-screen min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      
//     {/* Sidebar */}
//       <aside className="w-64 min-h-screen bg-gray-900 text-white p-4 flex flex-col">
//         <h2 className="text-xl font-bold mb-6">Dashboard</h2>
//         <nav>
//           <div>
//             <button
//               className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
//               onClick={() => toggleMenu("appointments")}
//             >
//               <FaCalendarCheck className="inline-block mr-2" /> Appointments
//             </button>
//             {activeMenu === "appointments" && (
//               <div className="pl-6">
                
//                 <button
//                   className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
//                   onClick={() => setActivePage("/request-appointment")}
//                 >
//                   Request Appointment
//                 </button>
//                 <button
//                   className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
//                   onClick={() => setActivePage("/completed-appointment")}
//                 >
//                   Completed Appointment
//                 </button>
//                 <button
//                   className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
//                   onClick={() => {setActivePage("/appointments");
        
//                   }}
//                 >
//                   Upcoming Appointments
//                 </button>
//               </div>
//             )}
            
//           </div>
//         </nav>
//       </aside>
//       {/* Header Section */}
//       <div className="flex items-center justify-end pr-64 pl-10 mb-6 fixed w-full top-0 left-64 z-50">
//         <div className="flex space-x-4">
//           <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700">
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
//               <FaHome  className="text-black dark:text-white" />
//             ) : (
//               <FaHome  className="text-white dark:text-white" />
//             )}
//           </button>
//           <button
//             onClick={logout}
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
//       {/* Dynamic Page Content */}
//         <div className="p-6 flex-1 overflow-auto">
//           {activePage === "/request-appointment" && (
//               <motion.div
//               className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <h2 className="text-xl font-semibold mb-4">Find Doctors</h2>
//               <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Search by name..."
//                   value={searchQuery.name}
//                   onChange={handleInputChange}
//                   className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   name="specialty"
//                   placeholder="Search by specialty..."
//                   value={searchQuery.specialty}
//                   onChange={handleInputChange}
//                   className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   type="submit"
//                   className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition"
//                 >
//                   Search
//                 </button>
//               </form>
//               {doctors.map((doctor) => (
//                 <div
//                   key={doctor._id}
//                   className="bg-gray-700 p-4 rounded-md flex justify-between items-center mb-4"
//                 >
//                   <div>
//                     <h2 className="text-lg font-bold">{doctor.name}</h2>
//                     <p className="text-gray-400">Specialty: {doctor.specialty}</p>
//                   </div>
//                   <button
//                     onClick={() => navigate(`/book-appointment/${doctor._id}`)}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               ))}
//               {doctors.length === 0 && (
//                 <p className="text-gray-400">No doctors found matching your search.</p>
//               )}
//             </motion.div>
//           )}
//            {activePage === "/completed-appointment" && (
//             <motion.div
//                     className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                   >
//                     <h2 className="text-xl font-semibold mb-4">Completed Appointments</h2>
//                     {completedAppointments.length > 0 ? (
//                       completedAppointments.map((appointment) => (
//                         <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
//                           <p>
//                             <span className="font-semibold">Date:</span>{" "}
//                             {new Date(appointment.date).toLocaleDateString()}
//                           </p>
//                           <p>
//                             <span className="font-semibold">Time:</span> {appointment.time}
//                           </p>
//                           <p>
//                             <span className="font-semibold">Doctor:</span>{" "}
//                             {appointment.doctorId?.name || "N/A"}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-400">No completed appointments yet.</p>
//                     )}
//                   </motion.div>
//            )}
//           {activePage === "/appointments" && (
//               <motion.div
//                       className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.6 }}
//                     >
//                       <h2 className="text-xl font-semibold mb-4">Upcoming Visits</h2>
//                       {upcomingAppointments.length > 0 ? (
//                         upcomingAppointments.map((appointment) => (
//                           <div key={appointment._id} className="bg-gray-700 p-4 rounded-md mb-4">
//                             <p>
//                               <span className="font-semibold">Date:</span>{" "}
//                               {new Date(appointment.date).toLocaleDateString()}
//                             </p>
//                             <p>
//                               <span className="font-semibold">Time:</span> {appointment.time}
//                             </p>
//                             <p>
//                               <span className="font-semibold">Doctor:</span>{" "}
//                               {appointment.doctorId?.name || "N/A"}
//                             </p>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-gray-400">No upcoming visits scheduled.</p>
//                       )}
//                     </motion.div>
//           )} 
//         </div>         
//     </div>
//   );
// };

// export default PatientDashboard;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/authContext";
import { dateFnsLocalizer } from "react-big-calendar";
import Cookies from "js-cookie";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaSignOutAlt, FaHome  , FaCalendarCheck } from "react-icons/fa";

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
  const token=Cookies.get("token")
  const userRole=Cookies.get("role")
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  // const [error, setError] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ name: "", specialty: "" });
  const [activeMenu, setActiveMenu] = useState(null);
  const [activePage, setActivePage] = useState("/request-appointment");

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  }, [theme]);

  const navigate = useNavigate();
  // const { logout } = useAuth();

  const fetchAppointments = async () => {
    try {
      const token = Cookies.get("token"); 
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/appointments`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetched Appointments:", response.data);
      const filteredAppointments = response.data.filter(
        (appointment) => appointment.status !== "completed"
      );
  
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };
 
  useEffect(() => {
    if(!token)navigate('/login')
    if(userRole!='patient')navigate('/')
    if (activePage === "/appointments") {
      fetchAppointments(); 
    }
  }, [activePage]); 

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchDoctors();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
  };
  const fetchDoctors = async () => {
    try {
      const token = Cookies.get("token"); 
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/doctors`,
        {
          withCredentials: true,
          params: searchQuery, 
        }
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = Cookies.get("token"); 
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/appointments/patient`,
          {
            withCredentials: true,
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
  const [role, setRole] = useState(null);
  useEffect(() => {
    const userRole = Cookies.get("role"); // Fetch role from cookies
    if (!userRole) {
      console.error("Role not found");
      return;
    }
    setRole(userRole);
  }, []);
  return (
    <div className={`flex h-screen min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Sidebar 
          activeMenu={activeMenu} 
          toggleMenu={toggleMenu} 
          activePage={activePage} 
          setActivePage={setActivePage}
          role={role} 
      />
      <Navbar />
     
      {/* Dynamic Page Content */}
        <div className="p-6 mt-16 flex-1 overflow-auto">
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