import React from "react";
import BookingRequests from "./BookingRequests";
import AddAppointment from "./AddAppointment";
import Appointments from "./Appointments";
import PatientList from "./PatientList";
import AddPatient from "./AddPatient";
import Payments from "./Payments";
import CreatePayment from "./CreatePayment";
import PendingPayments from "./PendingPayments";
import CompletePaymentModal from "./CompletePaymentModal";

const DoctorDynamicPage = ({ 
                              activePage, 
                              appointments,
                              markAsVisited,
                              newAppointment, 
                              setNewAppointment,  
                              handleAddAppointment, 
                              handleDeleteAppointment,
                              fetchAppointments,
                              bookingRequests, 
                              handleBookingAction, 
                              patients, 
                              handleAddPatient,
                              handleEditPatient, 
                              handleDeletePatient, 
                              handleUpdatePatient,
                              setEditingPatient,
                              editingPatient,
                              isModalOpen, 
                              setIsModalOpen,
                              selectedPayment, 
                              paymentDetails, 
                              setPaymentDetails, 
                              handleSubmitPayment,
                              pendingPayments, 
                              handleCompletePayment,
                              newPayment, 
                              setNewPayment,
                              handleCreatePayment,
                              payments,
                              theme, 
                              
                            }) => {
  console.log("Appointments received in DoctorDynamicPage:", appointments);                            
  return (
    <div className="p-6 overflow-auto">
      {activePage === "/booking-requests" && (
       <BookingRequests 
        bookingRequests={bookingRequests}
        handleBookingAction={handleBookingAction}
        theme={theme}
       />
      )}
      {activePage === "/add-appointment" && 
       <AddAppointment 
          newAppointment={newAppointment}
          setNewAppointment={setNewAppointment}
          handleAddAppointment={handleAddAppointment}
          theme={theme}
        />
      }
      {activePage === "/appointments" && (
        <Appointments 
          appointments={appointments}
          markAsVisited={markAsVisited} 
          handleDeleteAppointment={handleDeleteAppointment} 
          fetchAppointments={fetchAppointments}
        />

      )}
      {activePage === "/patient-list" && (
        <PatientList 
          patients={patients}
          handleEditPatient={handleEditPatient}
          handleDeletePatient={handleDeletePatient}
          handleUpdatePatient={handleUpdatePatient}
          editingPatient={editingPatient}
          setEditingPatient={setEditingPatient}
        />
      )}
      {activePage === "/add-patient" && (
        <AddPatient 
          theme={theme} 
          handleAddPatient={handleAddPatient} 
        />
      )}
      {activePage === "/payments" && (
        <Payments 
          payments={payments}
        />
      )}
      {activePage === "/create-payment" && (
        <CreatePayment 
          newPayment={newPayment}
          setNewPayment={setNewPayment}
          handleCreatePayment={handleCreatePayment}
        />
      )}
      {activePage === "/pending-payments" && (
        <PendingPayments  
          pendingPayments={pendingPayments}
          handleCompletePayment={handleCompletePayment}
        />
      )}
      {activePage === "/complete-payment" && (
        <CompletePaymentModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          selectedPayment={selectedPayment} 
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails} 
          handleSubmitPayment={handleSubmitPayment}
          />
        )}
    </div>
  );
};

export default DoctorDynamicPage;
