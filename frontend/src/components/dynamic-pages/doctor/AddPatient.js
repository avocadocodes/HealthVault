import React, { useState } from "react";

const AddPatient = ({ theme, handleAddPatient }) => {
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    issue: "",
    medicines: "",
    status: "Critical",
  });

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Add New Patient</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Patient Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
        />
        <input
          type="number"
          placeholder="Age"
          value={newPatient.age}
          onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
          className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
        />
        <select
          value={newPatient.gender}
          onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
          className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Health Issue"
          value={newPatient.issue}
          onChange={(e) => setNewPatient({ ...newPatient, issue: e.target.value })}
          className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
        />
        <input
          type="text"
          placeholder="Prescribed medicines"
          value={newPatient.medicines}
          onChange={(e) => setNewPatient({ ...newPatient, medicines: e.target.value })}
          className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
        />
        <select
          value={newPatient.status}
          onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })}
          className={`p-3 ${theme === "dark" ? "bg-customGrayLight2 text-white" : "bg-white text-black"} rounded-md focus:outline-none`}
        >
          <option value="Critical">Critical</option>
          <option value="Mid-Risk">Mid-Risk</option>
          <option value="Low-Risk">Low-Risk</option>
        </select>
      </div>
      <button
        onClick={() => handleAddPatient(newPatient, setNewPatient)}
        className="bg-blue-500 px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
      >
        Add Patient
      </button>
    </div>
  );
};

export default AddPatient;
