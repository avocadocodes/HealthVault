import React from "react";

const BookingRequests = ({ bookingRequests, handleBookingAction, theme }) => {
  if (!Array.isArray(bookingRequests)) {
    console.error("Error: bookingRequests is not an array", bookingRequests);
    return <p className="text-gray-400">No booking requests available.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Booking Requests</h3>
      {bookingRequests.length > 0 ? (
        bookingRequests.map((request) => (
          <div
            key={request._id}
            className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} 
                        p-4 rounded-md mb-4 flex justify-between items-center`}
          >
            <div>
              <h4 className="font-semibold">{request.patientName}</h4>
              <p>Issue: {request.healthIssue}</p>
              <p>Date: {new Date(request.date).toLocaleDateString()}</p>
              <p>Time: {request.time}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleBookingAction(request._id, "approve")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleBookingAction(request._id, "cancel")}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No pending booking requests.</p>
      )}
    </div>
  );
};

export default BookingRequests;
