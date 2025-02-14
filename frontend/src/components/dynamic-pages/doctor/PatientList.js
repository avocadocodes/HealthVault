import React, {useState,useEffect} from "react";

const PatientList = ({patients=[],  handleEditPatient, handleDeletePatient, handleUpdatePatient,editingPatient, 
  setEditingPatient, theme }) => {
  //   const [patients,setPatients]=useState([])
  //   const fetchPatients = async () => {
  //     try {
  //       console.log("Fetching patient data...");
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/patients`,
  //         {withCredentials: true }
  //       );
  //       console.log("Fetched Patients:", response.data);
  //       if (Array.isArray(response.data)) {
  //         setPatients(response.data);
  //       } else {
  //         console.error("Patients response is not an array!", response.data);
  //         setPatients([]); 
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch patients:", err);
  //     }
  //   };
  // // const [editingPatient, setEditingPatient] = useState(null); // Track the patient being edited

  // // const handleEditPatient = (patient) => {
  // //   console.log("Editing patient:", patient); // Debugging
  // //   setEditingPatient(patient);
  // // };
  useEffect(()=>{
    console.log("huihui",patients)
  },[patients])
  return(
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
    {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
            <h3 className="text-xl font-bold mb-4">Edit Patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={editingPatient.name}
                onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              />
              <input
                type="number"
                placeholder="Age"
                value={editingPatient.age}
                onChange={(e) => setEditingPatient({ ...editingPatient, age: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              />
              <select
                value={editingPatient.gender}
                onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Health Issue"
                value={editingPatient.issue}
                onChange={(e) => setEditingPatient({ ...editingPatient, issue: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              />
              <input
                type="text"
                placeholder="Prescribed Medicines"
                value={editingPatient.medicines}
                onChange={(e) => setEditingPatient({ ...editingPatient, medicines: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              />
              <select
                value={editingPatient.status}
                onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value })}
                className="p-3 border rounded-md focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="Mid-Risk">Mid-Risk</option>
                <option value="Low-Risk">Low-Risk</option>
              </select>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleUpdatePatient(editingPatient, setEditingPatient)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update Patient
              </button>
              <button
                onClick={() => setEditingPatient(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
          </div>
    )}
  </div>
)};

export default PatientList;
