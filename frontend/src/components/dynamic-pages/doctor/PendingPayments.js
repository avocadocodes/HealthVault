import React from "react";

const PendingPayments = ({ pendingPayments, handleCompletePayment, theme }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Pending Payments</h3>
    {pendingPayments.length > 0 ? (
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Remarks</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingPayments.map((payment) => (
            <tr key={payment._id}>
              <td className="border p-2">{payment.name}</td>
              <td className="border p-2">{payment.amount}</td>
              <td className="border p-2">{payment.remarks || "N/A"}</td>
              <td className="border p-2">
                <button
                  onClick={() => {
                    console.log("Clicked Complete for:", payment);
                    handleCompletePayment(payment);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-400">No pending payments found.</p>
    )}
  </div>
);

export default PendingPayments;
