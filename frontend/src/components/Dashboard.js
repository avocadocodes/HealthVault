import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch patients and stats on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/patients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatients(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch patients.");
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/patients/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(response.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchPatients();
    fetchStats();
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

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <h3>Patient Stats</h3>
      {stats.map((stat) => (
        <p key={stat._id}>
          {stat._id}: {stat.count}
        </p>
      ))}

      <h3>Patients List</h3>
      {patients.length > 0 ? (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>
                  <button onClick={() => navigate(`/patients/edit/${patient._id}`)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(patient._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
};

export default Dashboard;
