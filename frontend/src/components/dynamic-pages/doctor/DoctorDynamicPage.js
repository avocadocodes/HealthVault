import React from "react";
import BookingRequests from "./BookingRequests";
import AddAppointment from "./AddAppointment";
import Appointments from "./Appointments";
import PatientList from "./PatientList";
import Payments from "./Payments";
import CreatePayment from "./CreatePayment";
import PendingPayments from "./PendingPayments";
import CompletePaymentModal from "./CompletePaymentModal";

const DoctorDynamicPage = ({ activePage, props }) => {
  return (
    <div className="p-6 overflow-auto">
      {activePage === "/booking-requests" && <BookingRequests {...props} />}
      {activePage === "/add-appointment" && <AddAppointment {...props} />}
      {activePage === "/appointments" && <Appointments appointments={appointments} markAsVisited={markAsVisited} handleDeleteAppointment={handleDeleteAppointment} />
    }
      {activePage === "/patient-list" && <PatientList {...props} />}
      {activePage === "/payments" && <Payments {...props} />}
      {activePage === "/create-payment" && <CreatePayment {...props} />}
      {activePage === "/pending-payments" && <PendingPayments {...props} />}
      {activePage === "/complete-payment" && <CompletePaymentModal {...props} />}
    </div>
  );
};

export default DoctorDynamicPage;
