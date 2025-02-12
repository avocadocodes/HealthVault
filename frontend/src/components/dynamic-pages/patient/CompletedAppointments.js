import React from "react";
import { motion } from "framer-motion";

const CompletedAppointments = ({ completedAppointments }) => (
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
          <p><span className="font-semibold">Date:</span> {new Date(appointment.date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Time:</span> {appointment.time}</p>
          <p><span className="font-semibold">Doctor:</span> {appointment.doctorId?.name || "N/A"}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No completed appointments yet.</p>
    )}
  </motion.div>
);

export default CompletedAppointments;
