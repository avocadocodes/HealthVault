import React from "react";

const CompletePaymentModal = ({ isModalOpen, setIsModalOpen, selectedPayment, paymentDetails, setPaymentDetails, handleSubmitPayment }) => (
  isModalOpen && selectedPayment ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
        <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
        <div className="grid grid-cols-1 gap-4">
          <select
            value={paymentDetails.type}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, type: e.target.value })}
            className="p-3 border rounded-md focus:outline-none"
          >
            <option value="">Select Payment Type</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <input
            type="text"
            placeholder="Transaction ID"
            value={paymentDetails.transactionId}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
            className="p-3 border rounded-md focus:outline-none"
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <button onClick={handleSubmitPayment} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Submit
          </button>
          <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null
);

export default CompletePaymentModal;
