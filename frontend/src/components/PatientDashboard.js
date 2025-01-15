import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/doctors`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctors(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Find Doctors</h1>
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
            onClick={() =>
              navigate(`/book-appointment/${doctor._id}`)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
};

export default PatientDashboard;
