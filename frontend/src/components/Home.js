import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeroImage from "../images/hero.jpg";
import ContactImage from "../images/contact.jpg";

// Custom Arrow Component
const CustomArrow = ({ direction, onClick }) => {
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-4 rounded-full cursor-pointer z-10 ${
        direction === "left" ? "left-4" : "right-4"
      }`}
      onClick={onClick}
    >
      {direction === "left" ? (
        <span>&#8592;</span> // Left Arrow (←)
      ) : (
        <span>&#8594;</span> // Right Arrow (→)
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 200, // Trigger animation 200px before the element is in view
      once: true, // Whether animation should happen only once
    });
  }, []);
  // Carousel settings with arrows
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite loop
    speed: 500, // Transition speed in ms
    slidesToShow: 3, // Number of slides visible
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Time interval for auto-scroll in ms
    nextArrow: <CustomArrow direction="right" />, // Custom right arrow
    prevArrow: <CustomArrow direction="left" />, // Custom left arrow
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
      {/* Navbar */}
      <div className="flex justify-between items-center p-6 bg-black text-white">
        <div className="text-2xl font-bold">HealthVault</div>
        <div className="flex space-x-6">
          <a href="#home" className="hover:underline">Home</a>
          <button onClick={() => navigate("/login")} className="hover:underline">Login</button>
          <button onClick={() => navigate("/register-user")} className="hover:underline">Sign Up</button>
        </div>
      </div>

      {/* Hero Section */}
    
      <section
        className="relative text-center py-40 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${HeroImage})`, // Replace with your hero image path
        }}
      >
        {/* Black Translucent Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content Above the Overlay */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Your story starts with us.</h1>
          <p className="text-lg mb-6">
            A simple example of a Landing Page you can build using Material Tailwind.
          </p>
          <button
            className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>


      {/* Services Section */}
      <section className="py-20 bg-gray-50" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-10">Services We Provide</h2>
        <Slider {...settings}>
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg mx-2 transition transform hover:-translate-y-2 duration-300"
            >
              <h3 className="text-xl font-semibold text-black-600 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </Slider>
      </section>

      {/* Contact Us Section */}
      <section
  className="relative p-12 bg-cover bg-center text-white"
  data-aos="fade-up"
  style={{
    backgroundImage: `url(${ContactImage})`, // Replace with your contact section image path
  }}
>
  {/* Black Translucent Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-60"></div>

  {/* Content Above the Overlay */}
  <div className="relative z-10 max-w-xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-6">Have questions?</h2>
    <p className="text-center text-gray-300 mb-8">
      Complete this form and we will get back to you in 24 hours.
    </p>
    <form>
      <input
        type="text"
        placeholder="Full Name"
        className="block w-full p-3 mb-4 border border-gray-300 rounded"
      />
      <input
        type="email"
        placeholder="Email Address"
        className="block w-full p-3 mb-4 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Message"
        className="block w-full p-3 mb-4 border border-gray-300 rounded"
        rows="4"
      ></textarea>
      <div className="flex items-center space-x-2 mb-6">
        <input type="checkbox" className="h-4 w-4" />
        <label className="text-gray-200">
          I agree to the Terms and Conditions
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-3 rounded hover:bg-gray-700"
      >
        Send Message
      </button>
    </form>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="text-center text-gray-400">
          © 2025 HealthVault. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
