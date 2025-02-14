import React from "react";

const Appointments = ({ appointments=[], handleDeleteAppointment, markAsVisited, theme }) => {
  console.log("Appointments received in Appointments.js:", appointments); 
  return(
  <div>
    <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
    {appointments && Array.isArray(appointments) && appointments.length > 0 ? (
    appointments.map((appointment) => (

        <div key={appointment._id} className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} p-4 rounded-md mb-4`}>
          <h4 className="font-semibold">{appointment.patientName}</h4>
          <p>Issue: {appointment.healthIssue}</p>
          <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
          <p>Time: {appointment.time}</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={() => markAsVisited(appointment._id)}>
            Mark as Visited
          </button>
          <button className="bg-red-500 px-4 py-2 mt-2 rounded-md hover:bg-red-600" onClick={() => handleDeleteAppointment(appointment._id)}>
            Delete
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No Appointments Scheduled.</p>
    )}
  </div>
)};

export default Appointments;
