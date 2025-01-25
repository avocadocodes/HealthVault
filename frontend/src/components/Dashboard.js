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
  const [doctorName, setDoctorName] = useState("");
  const [patients, setPatients] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data); 
      setEvents(
        response.data.map((event) => ({
          title: `${event.patientName} - ${event.healthIssue}`,
          start: new Date(`${event.date}T${event.time}`),
          end: new Date(`${event.date}T${event.time}`),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  
  // Call this function after approving a booking request
  // await fetchAppointments();
  // const fetchAppointments = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/appointments`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setAppointments(response.data); // Update state with backend data
  //   } catch (err) {
  //     console.error("Failed to fetch appointments:", err);
  //   }
  // };
  
  // // Call this function after approving a booking request
  // await fetchAppointments();
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
    fetchDoctorDetails(); // Call the function here
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
         // Fetch patients
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
        console.log("Fetched Appointments:", response.data);
        setAppointments(appointmentsResponse.data);

        // Fetch pending booking requests
        const bookingResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/booking-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Booking Requests:", bookingRequests);
        setBookingRequests(bookingResponse.data);

        // Fetch calendar events
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
        setBookingRequests(response.data); // Ensure this data is displayed in the modal
      } catch (err) {
        console.error("Failed to fetch booking requests:", err);
      }
    };
  
    fetchBookingRequests();
  }, []);
  
  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Welcome {doctorName ? `Dr. ${doctorName}` : " "}👋</h1>
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
          className="bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowBookingModal(true)}
        >
          <div>
            <h2 className="text-2xl font-semibold">Pending Requests</h2>
            <p className="text-gray-400">Booking requests</p>
          </div>
          <div className="text-green-500 text-4xl">💬</div>
        </motion.div>
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowAppointmentModal(true)}
        >
          <div>
            <h2 className="text-2xl font-semibold">Appointments</h2>
            {/* <p className="text-gray-400">Manually added</p> */}
          </div>
          <div className="text-blue-500 text-4xl">📅</div>
        </motion.div>
      </div>

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
    {/* Appointment Modal */}
    {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-800 text-white w-3/4 max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto"
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
                  className="p-3 bg-gray-700 rounded-md focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Health Issue"
                  value={newAppointment.healthIssue}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, healthIssue: e.target.value })
                  }
                  className="p-3 bg-gray-700 rounded-md focus:outline-none"
                />
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, date: e.target.value })
                  }
                  className="p-3 bg-gray-700 rounded-md focus:outline-none"
                />
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, time: e.target.value })
                  }
                  className="p-3 bg-gray-700 rounded-md focus:outline-none"
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
                  className="bg-gray-700 p-4 rounded-md mb-4"
                >
                  <h4 className="font-semibold">{appointment.patientName}</h4>
                  <p>Issue: {appointment.healthIssue}</p>
                  <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p>Time: {appointment.time}</p>
                  <button
                    className="bg-red-500 px-4 py-2 mt-2 rounded-md hover:bg-red-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-800 text-white w-3/4 max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto"
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
                  className="bg-gray-700 p-4 rounded-md mb-4 flex justify-between items-center"
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
                      // onClick={async () => {
                      //   try {
                      //     const token = localStorage.getItem("token");
                      //     console.log("Approving booking request with ID:", request._id);
                      //     if (!request._id) {
                      //       throw new Error("Invalid booking request ID");
                      //     }
                      //     const response = await axios.put(
                      //       `${process.env.REACT_APP_API_URL}/booking-requests/${request._id}/approve`,
                      //       {},
                      //       {
                      //         headers: { Authorization: `Bearer ${token}` },
                      //       }
                      //     );
                      //     if (!response.data || !response.data.appointment) {
                      //       throw new Error("Failed to receive appointment data from backend");
                      //     }
                      //     const newAppointment = response.data.appointment; // Get the approved appointment from response
                          
                          // Add the new appointment to the backend to ensure persistence
                          // await axios.post(
                          //   `${process.env.REACT_APP_API_URL}/appointments`,
                          //   {
                          //     patientName: newAppointment.patientName,
                          //     healthIssue: newAppointment.healthIssue,
                          //     date: newAppointment.date,
                          //     time: newAppointment.time,
                          //     doctorId: newAppointment.doctorId, // Ensure required fields are added
                          //     patientId: newAppointment.patientId, // Include patient reference
                          //   },
                          //   {
                          //     headers: { Authorization: `Bearer ${token}` },
                          //   }
                          // );

                          // const appointmentsResponse = await axios.get(
                          //   `${process.env.REACT_APP_API_URL}/appointments`,
                          //   {
                          //     headers: { Authorization: `Bearer ${token}` },
                          //   }
                          // );
                          // setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
                        //   if (!newAppointment) {
                        //     throw new Error("Failed to receive appointment data from backend");
                        //   }
                      
                        //   await fetchAppointments();
                        //   setBookingRequests((prevRequests) =>
                        //     prevRequests.filter((req) => req._id !== request._id)
                        //   );
                          
                        //   toast.success("Booking request approved and appointment created!");
                        // } catch (err) {
                        //   console.error("Error approving booking request:", err);
                        //   toast.error("Failed to approve booking request.");
                        // }
                      // }}
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
