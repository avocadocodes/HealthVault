import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
// import { useAuth } from "../context/authContext";
import { dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import axios from "axios";
import { toast } from "react-toastify";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaSignOutAlt, FaHome  , FaCalendarCheck, FaUser, FaMoneyBillWave } from "react-icons/fa";

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
  const token=Cookies.get("token")
  const [doctorName, setDoctorName] = useState("");
  const [patients, setPatients] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    healthIssue: "",
    date: "",
    time: "",
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [activePage, setActivePage] = useState("/booking-requests");
  const [reload, setReload] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male", 
  });
  const [editingPatient, setEditingPatient] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    name: "",
    amount: "",
    type: "Credit Card", 
    transactionId: "",
    paymentStatus: "Pending",
  });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null); 
  const [paymentDetails, setPaymentDetails] = useState({ type: "", transactionId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };
  const navigate = useNavigate();
  // const { logout } = useAuth();
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null; // Return null if cookie not found
  }
  const fetchDoctorDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/me`,
        { withCredentials: true } 
      );
      setDoctorName(response.data.name); 
      console.log(response)
    } catch (err) {
      console.error("Failed to fetch doctor details:", err);
      toast.error("Failed to fetch doctor details.");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  const fetchPatients = async () => {
    try {
      console.log("Fetching patient data...");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/patients`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched Patients:", response.data);
      if (Array.isArray(response.data)) {
        setPatients(response.data);
      } else {
        console.error("Patients response is not an array!", response.data);
        setPatients([]); 
      }
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };
  const handleEditPatient = (patient) => {
    setEditingPatient(patient); 
  };
  const handleUpdatePatient = async () => {
    if (!editingPatient.name || !editingPatient.age || !editingPatient.gender || !editingPatient.issue || !editingPatient.medicines || !editingPatient.status) {
      toast.error("All fields are required!");
      return;
    }
  
    try {
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
  const handleDeletePatient = async (patientId) => {
    try {
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
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/finance/payments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Fetched Payments:", response.data);
      setPayments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setPayments([]); 
    }
  };
  const handleCreatePayment = async () => {
    const formattedPayment = {
      ...newPayment,
      amount: Number(newPayment.amount), 
      transactionId: newPayment.paymentStatus === "Completed" ? newPayment.transactionId : undefined,
      type: newPayment.paymentStatus === "Completed" ? newPayment.type : undefined, 
      remarks: newPayment.remarks || "",
    };
    console.log("Submitting Payment Data:", formattedPayment);
    if (!newPayment.name || !newPayment.amount ||  !newPayment.paymentStatus) {
      toast.error("All fields are required!");
      return;
    }
    if (newPayment.paymentStatus === "Completed" && (!newPayment.type || !newPayment.transactionId)) {
      toast.error("Payment Type and Transaction ID are required for completed payments!");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/finance/payments`,
        formattedPayment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.payment) {
        if (formattedPayment.paymentStatus === "Completed") {
          setPayments((prevPayments) => [...prevPayments, response.data.payment]);
        } else {
          setPendingPayments((prevPayments) => [...prevPayments, response.data.payment]);
        }
  
        toast.success("Payment added successfully!");
        setNewPayment({ name: "", amount: "", type: "", transactionId: "", remarks: "", paymentStatus: "Pending" });
        setActivePage(formattedPayment.paymentStatus === "Completed" ? "/payments" : "/pending-payments");
        console.log("Submitting Payment Data:", JSON.stringify(formattedPayment, null, 2));

      } else {
        throw new Error("Failed to receive payment response from the server");
      }
    } catch (err) {
      console.error("Failed to create payment:", err);
      toast.error("Failed to add payment.");
    }
  };
  const fetchPendingPayments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/finance/pending-payments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Fetched Pending Payments:", response.data);
      setPendingPayments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch pending payments:", err);
      setPendingPayments([]);
    }
  };
  const handleCompletePayment = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };
  const handleSubmitPayment = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/finance/complete-payment/${selectedPayment._id}`,
        paymentDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("Payment marked as completed!");
      setIsModalOpen(false);
  
      setPendingPayments((prev) => prev.filter((p) => p._id !== selectedPayment._id));
    } catch (err) {
      console.error("Failed to complete payment:", err);
      toast.error("Failed to mark payment as completed.");
    }
  };
  
  
  // useEffect(() => {
  //   const token = Cookies.get("token");
  //   console.log(token)
  //   if (activePage === "/patient-list") {
  //     fetchPatients();
  //   }
  // }, [activePage]);
  
  // useEffect(() => {
  //   if (activePage === "/appointments") {
  //     fetchAppointments(); 
  //   }
  // }, [activePage]); 

  useEffect(() => {
    fetchDoctorDetails(); 
  }, []);

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       if (!token) {
  //         toast.error("Authentication required. Redirecting to login.");
  //         navigate("/login");
  //         return;
  //       }
  //       const patientsResponse = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/patients`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setPatients(patientsResponse.data);

  //       await fetchAppointments();
  //       const appointmentsResponse = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/appointments`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       console.log("Fetched Appointments:", appointmentsResponse.data);
  //       setAppointments(appointmentsResponse.data);
  //       const bookingResponse = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/booking-requests`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       console.log("Booking Requests:", bookingRequests);
  //       setBookingRequests(bookingResponse.data);
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.response?.data?.message || "Failed to fetch dashboard data.");
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);
  
  // useEffect(() => {
  //   const fetchBookingRequests = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/booking-requests`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setBookingRequests(response.data); 
  //     } catch (err) {
  //       console.error("Failed to fetch booking requests:", err);
  //     }
  //   };
  
  //   fetchBookingRequests();
  // }, []);
  // useEffect(() => {
  //   document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  // }, [theme]);

  // useEffect(() => {
  //   console.log("Re-render triggered, Appointments:", appointments);
  //   setReload(prev => !prev);
  // }, [appointments]);
 
  // useEffect(() => {
  //   if (activePage === "/payments") {
  //     fetchPayments();
  //   }
  // }, [activePage]);
  // useEffect(() => {
  //   if (activePage === "/pending-payments") {
  //     fetchPendingPayments();
  //   }
  // }, [activePage]);
  
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
                <button 
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" 
                  onClick={() => {setActivePage("/patient-list");

                  }}>
                    Patient List
                  </button>
                <button 
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" 
                  onClick={() => {setActivePage("/add-patient");

                  }}>Add Patient</button>
              </div>
            )}
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              onClick={() => toggleMenu("finance")}
            >
              <FaMoneyBillWave className="inline-block mr-2 " />Finance
            </button>
            {activeMenu === "finance" && (
              <div className="pl-6">
                <button 
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" 
                  onClick={() => setActivePage("/payments")}
                >
                  Completed Payments
                </button>
                <button 
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" 
                  onClick={() => setActivePage("/create-payment")}
                >
                  Add Payments
                </button>
                <button 
                  className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" 
                  onClick={() => setActivePage("/pending-payments")}
                >
                  Pending Payments
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
            // onClick={logout}
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
        
        {activePage === "/patient-list" && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Patients List</h3>
            {patients.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Age</th>
                    <th className="border p-2">Gender</th>
                    <th className="border p-2">Health Issue</th>
                    <th className="border p-2">Medicine Prescribed</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients && patients.length > 0 ? (
                    patients.map((patient) => (
                      <tr key={patient?._id || Math.random()}>
                        <td className="border p-2">{patient?.name || ""}</td>
                        <td className="border p-2">{patient?.age}</td>
                        <td className="border p-2">{patient?.gender }</td>
                        <td className="border p-2">{patient?.issue }</td>
                        <td className="border p-2">{patient?.medicines }</td>
                        <td className="border p-2">{patient?.status}</td>
                        <td className="border p-2 flex space-x-2">
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-4">No Patients Found.</td>
                    </tr>
                  )}
                </tbody>

              </table>
            ) : (
              <p className="text-gray-400">No Patients Found.</p>
            )}
          </div>
        )}
        {editingPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
              <h3 className="text-xl font-bold mb-4">Edit Patient</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={editingPatient.age}
                  onChange={(e) => setEditingPatient({ ...editingPatient, age: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                />
                <select
                  value={editingPatient.gender}
                  onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Health Issue"
                  value={editingPatient.issue}
                  onChange={(e) => setEditingPatient({ ...editingPatient, issue: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Prescribed Medicines"
                  value={editingPatient.medicines}
                  onChange={(e) => setEditingPatient({ ...editingPatient, medicines: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                />
                <select
                  value={editingPatient.status}
                  onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="Mid-Risk">Mid-Risk</option>
                  <option value="Low-Risk">Low-Risk</option>
                </select>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleUpdatePatient}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update Patient
                </button>
                <button
                  onClick={() => setEditingPatient(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activePage === "/add-patient" && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Add New Patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />
              <input
                type="number"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />

              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Health Issue"
                value={newPatient.issue}
                onChange={(e) => setNewPatient({ ...newPatient, issue: e.target.value })}
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />
              <input
                type="text"
                placeholder="Prescribed medicines"
                value={newPatient.medicines}
                onChange={(e) => setNewPatient({ ...newPatient, medicines: e.target.value })}
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              />
              <select
                value={newPatient.status}
                onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })}
                className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
              >
                <option value="Crtical">Critical</option>
                <option value="Mid-Risk">Mid-Risk</option>
                <option value="Low-Risk">Low-Risk</option>
              </select>
            </div>
            <button
              onClick={handleAddPatient}
              className="bg-blue-500 px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
            >
              Add Patient
            </button>
          </div>
        )}
        {activePage === "/payments" && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Payments</h3>
            {payments.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Amount (INR)</th>
                    <th className="border p-2">Payment Type</th>
                    <th className="border p-2">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index}>
                      <td className="border p-2">{payment.name}</td>
                      <td className="border p-2">{payment.amount}</td>
                      <td className="border p-2">{payment.type}</td>
                      <td className="border p-2">{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No payments found.</p>
            )}
          </div>
        )}
        {activePage === "/create-payment" && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Add a payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Payer Name"
                value={newPayment.name}
                onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount (INR)"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              />
              <input
                type="text"
                placeholder="Remarks"
                value={newPayment.remarks}
                onChange={(e) => setNewPayment({ ...newPayment, remarks: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              />
              <select
                value={newPayment.status}
                onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              {newPayment.status === "Completed" && (
                <>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                    className="p-3 border rounded-md focus:outline-none"
                  >
                    <option value="">Select Payment Type</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={newPayment.transactionId}
                    onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
                    className="p-3 border rounded-md focus:outline-none"
                  />
                </>
              )}
            </div>
            <button
              onClick={handleCreatePayment}
              className="bg-blue-500 px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
            >
              Add Payment
            </button>
          </div>
        )}
        {activePage === "/pending-payments" && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Pending Payments</h3>
            {pendingPayments.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Remarks</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="border p-2">{payment.name}</td>
                      <td className="border p-2">${payment.amount}</td>
                      <td className="border p-2">{payment.remarks||"N/A"}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleCompletePayment(payment)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No pending payments found.</p>
            )}
          </div>
        )}
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
              <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
              <div className="grid grid-cols-1 gap-4">
                <select
                  value={paymentDetails.type}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, type: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                >
                  <option value="">Select Payment Type</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <input
                  type="text"
                  placeholder="Transaction ID"
                  value={paymentDetails.transactionId}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                  className="p-3 border rounded-md focus:outline-none"
                />
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleSubmitPayment}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}



      </div>         
    </div>
  );
};

export default Dashboard;
