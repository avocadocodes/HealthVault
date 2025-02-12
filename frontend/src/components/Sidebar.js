import React from "react";
import { FaCalendarCheck, FaUser, FaMoneyBillWave } from "react-icons/fa";

const Sidebar = ({ role, activeMenu, toggleMenu, setActivePage }) => {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">{role === "doctor" ? "Doctor Dashboard" : "Patient Dashboard"}</h2>
      <nav>
        <div>
          <button
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
            onClick={() => toggleMenu("appointments")}
          >
            <FaCalendarCheck className="inline-block mr-2" /> Appointments
          </button>
          {activeMenu === "appointments" && (
            <div className="pl-6">
              {role === "doctor" ? (
                <>
                  <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/booking-requests")}>Booking Requests</button>
                  <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/add-appointment")}>Add Appointment</button>
                </>
              ) : (
                <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/request-appointment")}>Request Appointment</button>
              )}
              <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/appointments")}>Upcoming Appointments</button>
            </div>
          )}
        </div>

        {role === "doctor" && (
          <>
            <div>
              <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => toggleMenu("patients")}>
                <FaUser className="inline-block mr-2" /> Patients
              </button>
              {activeMenu === "patients" && (
                <div className="pl-6">
                  <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/patient-list")}>Patient List</button>
                  <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/add-patient")}>Add Patient</button>
                </div>
              )}
            </div>

            <div>
              <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => toggleMenu("finance")}>
                <FaMoneyBillWave className="inline-block mr-2" /> Finance
              </button>
              {activeMenu === "finance" && (
                <div className="pl-6">
                  <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/payments")}>Completed Payments</button>
                  <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/create-payment")}>Add Payments</button>
                  <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded" onClick={() => setActivePage("/pending-payments")}>Pending Payments</button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
