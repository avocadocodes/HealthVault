import React from "react";

const Payments = ({ payments, theme }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Payments</h3>
    {payments.length > 0 ? (
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Amount (INR)</th>
            <th className="border p-2">Payment Type</th>
            <th className="border p-2">Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td className="border p-2">{payment.name}</td>
              <td className="border p-2">{payment.amount}</td>
              <td className="border p-2">{payment.type}</td>
              <td className="border p-2">{payment.transactionId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-400">No payments found.</p>
    )}
  </div>
);

export default Payments;
