import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
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
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch appointments.");
      }
    };

    fetchAppointments();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (appointments.length === 0) {
    return <p>No upcoming appointments.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
      <ul className="list-disc ml-5">
        {appointments.map((appointment) => (
          <li key={appointment._id} className="mb-2">
            <p>
              <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {appointment.time}
            </p>
            <p>
              <strong>Doctor:</strong> {appointment.doctorId?.name || "N/A"} 
            </p>
            <p>
              <strong>Health Issue:</strong> {appointment.healthIssue}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientAppointments;
