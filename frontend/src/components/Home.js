import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

// Import React-Slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrow Component
const CustomArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={`${className} bg-blue-600 rounded-full hover:bg-blue-700`}
      style={{ ...style, display: "block", fontSize: "20px" }}
      onClick={onClick}
    />
  );
};

const Home = () => {
  const navigate = useNavigate();

  // Carousel settings with arrows
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablet view
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // Mobile view
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Services data
  const services = [
    {
      title: "Track Patient Stats",
      description:
        "Doctors can monitor patient statistics and manage health data seamlessly.",
    },
    {
      title: "Manage Doctors",
      description:
        "Admins can oversee doctors, manage their profiles, and track activities efficiently.",
    },
    {
      title: "Centralized Data",
      description:
        "Secure and centralized storage of all healthcare data for easy access and management.",
    },
    {
      title: "Role-Based Access",
      description:
        "Each user gets specific permissions to access data based on their role.",
    },
    {
      title: "Real-Time Monitoring",
      description:
        "Track patient vitals and health metrics in real-time for better care.",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Gain insights into patient trends and doctor performance through analytics.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to HealthVault
          </h1>
          <p className="text-lg md:text-xl mb-8">
            A platform to manage and track healthcare data for patients,
            doctors, and admins.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-600 px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register-user")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Services We Provide
          </h2>
          <Slider {...settings}>
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg mx-2 transition transform hover:-translate-y-2 duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">About Us</h4>
              <p className="text-gray-400">
                HealthVault is a platform designed to make
                healthcare management seamless and efficient for patients,
                doctors, and administrators.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Have a Query?</h4>
              <form>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Your Message"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8">
            © 2025 HealthVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
