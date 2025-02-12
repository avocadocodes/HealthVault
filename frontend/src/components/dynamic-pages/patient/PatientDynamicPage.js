import React from "react";
import RequestAppointment from "./RequestAppointment";
import CompletedAppointments from "./CompletedAppointments";
import UpcomingAppointments from "./UpcomingAppointments";

const PatientDynamicPage = ({ activePage, props }) => {
  switch (activePage) {
    case "/request-appointment":
      return <RequestAppointment {...props} />;
    case "/completed-appointment":
      return <CompletedAppointments {...props} />;
    case "/appointments":
      return <UpcomingAppointments {...props} />;
    default:
      return <p className="text-gray-400">Select an option from the menu.</p>;
  }
};

export default PatientDynamicPage;
