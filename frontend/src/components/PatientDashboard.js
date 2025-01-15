import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hasUnseenNotifications, setHasUnseenNotifications] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch doctors
        const doctorsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/doctors`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctors(doctorsResponse.data);

        // Fetch appointments
        const appointmentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(appointmentsResponse.data);

        // Fetch notifications
        const notificationsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(notificationsResponse.data);
        setHasUnseenNotifications(
          notificationsResponse.data.some((n) => !n.isSeen)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search)
  );

  const markNotificationsAsSeen = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/notifications/mark-seen`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasUnseenNotifications(false);
    } catch (err) {
      console.error("Failed to mark notifications as seen:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <div className="relative">
          <button
            onClick={markNotificationsAsSeen}
            className="relative bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Notifications
            {hasUnseenNotifications && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4">
            {notifications.map((notification) => (
              <p
                key={notification._id}
                className={notification.isSeen ? "text-gray-500" : "text-black"}
              >
                {notification.message}
              </p>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Find Doctors</h2>
      <input
        type="text"
        placeholder="Search doctors..."
        value={search}
        onChange={handleSearch}
        className="w-full p-3 mb-6 border border-gray-300 rounded-md"
      />
      {filteredDoctors.map((doctor) => (
        <div
          key={doctor._id}
          className="bg-white p-4 shadow-md rounded-md mb-4 flex justify-between items-center"
        >
          <div>
            <h2 className="text-xl font-bold">{doctor.name}</h2>
            <p className="text-gray-600">Specialty: {doctor.specialty}</p>
          </div>
          <button
            onClick={() => navigate(`/book-appointment/${doctor._id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Book Appointment
          </button>
        </div>
      ))}

      <h2 className="text-2xl font-bold mb-4">Upcoming Visits</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id} className="mb-4">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {appointment.time}
            </p>
            <p>
              <strong>Doctor:</strong> {appointment.doctorName}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDashboard;
