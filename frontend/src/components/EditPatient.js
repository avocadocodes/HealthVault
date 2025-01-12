import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPatient = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/patients/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData(response.data);
        setLoading(false); // Data has been fetched
      } catch (err) {
        setError("Failed to load patient data.");
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/patients/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update patient.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Patient</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={(e) =>
          setFormData({ ...formData, age: e.target.value })
        }
        required
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={(e) =>
          setFormData({ ...formData, gender: e.target.value })
        }
        required
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <button type="submit">Update Patient</button>
    </form>
  );
};

export default EditPatient;
