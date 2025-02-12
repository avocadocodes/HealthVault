import React from "react";

const AddAppointment = ({ newAppointment, setNewAppointment, handleAddAppointment, theme }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Add New Appointment</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Patient Name"
        value={newAppointment.patientName}
        onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      />
      <input
        type="text"
        placeholder="Health Issue"
        value={newAppointment.healthIssue}
        onChange={(e) => setNewAppointment({ ...newAppointment, healthIssue: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      />
      <input
        type="date"
        value={newAppointment.date}
        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      />
      <input
        type="time"
        value={newAppointment.time}
        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      />
    </div>
    <button onClick={handleAddAppointment} className="bg-blue-500 px-4 py-2 rounded-md mt-4 hover:bg-blue-600">
      Add Appointment
    </button>
  </div>
);

export default AddAppointment;
