import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RequestAppointment = ({ searchQuery, setSearchQuery, handleSearchSubmit, doctors }) => {
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
        <button type="submit" className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition">
          Search
        </button>
      </form>
      {doctors.map((doctor) => (
        <div key={doctor._id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center mb-4">
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
      {doctors.length === 0 && <p className="text-gray-400">No doctors found matching your search.</p>}
    </motion.div>
  );
};

export default RequestAppointment;
