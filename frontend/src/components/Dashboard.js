import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  // Fetch patients, booking requests, and events on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch patients
        const patientsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/patients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatients(patientsResponse.data);

        // Fetch pending booking requests
        const bookingResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/booking-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingRequests(bookingResponse.data);

        // Fetch calendar events
        const eventsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/calendar-events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(
          eventsResponse.data.map((event) => ({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);

  // Handle patient deletion
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(patients.filter((patient) => patient._id !== id));
      toast.success("Patient deleted successfully");
    } catch (err) {
      toast.error("Failed to delete patient");
    }
  };

  // Handle booking acceptance/rejection
  const handleBookingAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/booking-requests/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Booking request ${action}ed successfully!`);
      setBookingRequests(bookingRequests.filter((req) => req._id !== id));
    } catch (err) {
      toast.error("Failed to update booking request.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => navigate("/register-patient")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Patient
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      {/* Patient Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Patients List
        </h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{patient.name}</td>
                    <td className="py-3 px-4">{patient.age}</td>
                    <td className="py-3 px-4">{patient.gender}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        onClick={() => navigate(`/patients/${patient._id}/stats`)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      >
                        Stats
                      </button>
                      <button
                        onClick={() => navigate(`/patients/edit/${patient._id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-600"
                  >
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Booking Requests */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Pending Booking Requests
        </h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {bookingRequests.length > 0 ? (
            bookingRequests.map((request) => (
              <div
                key={request._id}
                className="flex items-center justify-between p-4 border-b last:border-none"
              >
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Patient:</span>{" "}
                    {request.patientName}
                  </p>
                  <p className="text-gray-500">
                    <span className="font-semibold">Requested Date:</span>{" "}
                    {new Date(request.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleBookingAction(request._id, "accept")}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleBookingAction(request._id, "reject")}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 p-4">No pending booking requests.</p>
          )}
        </div>
      </div>

      {/* Calendar Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Calendar</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
