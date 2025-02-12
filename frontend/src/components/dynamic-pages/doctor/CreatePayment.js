import React from "react";

const CreatePayment = ({ newPayment, setNewPayment, handleCreatePayment, theme }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Add a Payment</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Payer Name"
        value={newPayment.name}
        onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      />
      <input
        type="number"
        placeholder="Amount (INR)"
        value={newPayment.amount}
        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      />
      <input
        type="text"
        placeholder="Remarks"
        value={newPayment.remarks}
        onChange={(e) => setNewPayment({ ...newPayment, remarks: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      />
      <select
        value={newPayment.status}
        onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
        className={`p-3 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md`}
      >
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
    <button onClick={handleCreatePayment} className="bg-blue-500 px-4 py-2 rounded-md mt-4 hover:bg-blue-600">
      Add Payment
    </button>
  </div>
);

export default CreatePayment;
