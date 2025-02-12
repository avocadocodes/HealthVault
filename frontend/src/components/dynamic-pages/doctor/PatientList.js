import React from "react";

const PatientList = ({ patients, handleEditPatient, handleDeletePatient, theme }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Patients List</h3>
    {patients.length > 0 ? (
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Health Issue</th>
            <th className="border p-2">Medicine</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td className="border p-2">{patient.name}</td>
              <td className="border p-2">{patient.age}</td>
              <td className="border p-2">{patient.gender}</td>
              <td className="border p-2">{patient.issue}</td>
              <td className="border p-2">{patient.medicines}</td>
              <td className="border p-2 flex space-x-2">
                <button onClick={() => handleEditPatient(patient)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
                  Edit
                </button>
                <button onClick={() => handleDeletePatient(patient._id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-400">No Patients Found.</p>
    )}
  </div>
);

export default PatientList;
