import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = ({ doctorId }) => {
  const [doctor, setDoctor] = useState({
    profilePic: "",
    name: "",
    specialty: "",
    clinicAddress: "",
    educationHistory: [],
    ratings: [],
  });
  const [newEducation, setNewEducation] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${doctorId}`, {
          withCredentials: true,
        });
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        toast.error("Failed to load profile data.");
      }
    };
    fetchDoctorProfile();
  }, [doctorId]);

  // Handle Image Upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/profile/${doctorId}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      setDoctor((prev) => ({ ...prev, profilePic: data.profilePic }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload image.");
    }
  };

  // Handle Updating Profile
  const handleProfileUpdate = async () => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/profile/${doctorId}`, doctor, {
        withCredentials: true,
      });
      setDoctor(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Doctor Profile</h2>

      <div className="flex flex-col items-center">
        <label htmlFor="profilePicInput">
          <img
            src={doctor.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border border-gray-300 cursor-pointer"
          />
        </label>
        <input type="file" id="profilePicInput" className="hidden" onChange={handleProfilePicUpload} />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Name:</label>
        <input
          type="text"
          value={doctor.name}
          onChange={(e) => setDoctor((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Specialty:</label>
        <input
          type="text"
          value={doctor.specialty}
          onChange={(e) => setDoctor((prev) => ({ ...prev, specialty: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Clinic Address:</label>
        <input
          type="text"
          value={doctor.clinicAddress}
          onChange={(e) => setDoctor((prev) => ({ ...prev, clinicAddress: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>

      <button onClick={handleProfileUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Save Changes
      </button>
    </div>
  );
};

export default DoctorProfile;
