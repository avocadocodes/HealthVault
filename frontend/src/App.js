import React from "react";
import "./tailwind.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Store/store"; 
// import { AuthProvider, useAuth } from "./context/authContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RegisterUser from "./components/RegisterUser";
import PatientDetails from "./components/PatientDetails";
import PatientDashboard from "./components/PatientDashboard";
import BookAppointment from "./components/BookAppointment";
import PatientAppointments from "./components/PatientAppointments";
import "./index.css";

// const ProtectedRoute = ({ element, roleRequired }) => {
//   // const { token, role } = useAuth();
//   return token && role === roleRequired ? element : <Navigate to="/login" />;
// };

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register-user", element: <RegisterUser /> },
  { path: "/dashboard", element: <Dashboard/>},
  { path: "/patient-dashboard", element: <PatientDashboard /> },
  { path: "/patients/:id/stats", element: <PatientDetails /> },
  { path: "/book-appointment/:doctorId", element: <BookAppointment /> },
  { path: "/patient-appointments", element: <PatientAppointments /> },
]);

const App = () => {
  return (
      <ThemeProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
          <ToastContainer />
        </Provider>
      </ThemeProvider>
  );
};

export default App; 
