import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import Cookies from "js-cookie";
import "slick-carousel/slick/slick.css";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import HeroImageBlack from "../images/heroblack.png";
import HeroImageWhite from "../images/herowhite.png";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaSignOutAlt,FaUserPlus, FaTachometerAlt, FaSignInAlt, FaBookOpen } from "react-icons/fa";

const CustomArrow = ({ direction, onClick }) => {
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-4 rounded-full cursor-pointer z-10 ${
        direction === "left" ? "left-4" : "right-4"
      }`}
      onClick={onClick}
    >
      {direction === "left" ? (
        <span>&#8592;</span> 
      ) : (
        <span>&#8594;</span> 
      )}
    </div>
  );
};

const Home = () => {
  const token=Cookies.get("token")
  const role=Cookies.get("role")
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
    AOS.init({ duration: 1000, offset: 200, once: true });
  }, [theme]);
  
  const navigate = useNavigate();

  const handleDashboardRedirect = async () => {
    try {
      
      if(!token)navigate('/login')
  
      navigate(role === "patient" ? "/patient-dashboard" : "/dashboard");
    } catch (error) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  };
  
  const blogs = [
    { title: "Healthy Living Tips", description: "Discover ways to maintain a healthy lifestyle.", url: "https://www.healthline.com/health/how-to-maintain-a-healthy-lifestyle" },
    { title: "Nutrition & Diet", description: "Learn about balanced diets and nutrition.", url: "https://nutritionfacts.org/blog/" },
    { title: "Mental Wellbeing", description: "Mental health strategies for a balanced life.", url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/" },
  ];
 
  const settings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 3, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 2000, 
    nextArrow: <CustomArrow direction="right" />, 
    prevArrow: <CustomArrow direction="left" />, 
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
      title: "Role-Based Access",
      description:
        "Each user gets specific permissions to access data based on their role.",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Gain insights into patient trends and doctor performance through analytics.",
    },
  ];

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>

      {/* Navbar */}
      <div className={`flex justify-between items-center p-6 ${theme === "dark" ? "text-white" : " text-black"}`}>
        <div className="text-2xl font-bold">HealthVault</div>
        <div className="flex space-x-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === "light" ? (
              <FaMoon className="text-black dark:text-white" />
            ) : (
              <FaSun className="text-white dark:text-white" />
            )}
          </button>
          {document.cookie.includes("token=")  ? (
            <>
              <button 
              // onClick={logout} 
              className="hover:underline">
                {theme === "light" ? (
                  <FaSignOutAlt className="text-black dark:text-white" />
                ) : (
                  <FaSignOutAlt className="text-white dark:text-white" />
                )}
              </button>
              <button onClick={handleDashboardRedirect} className="hover:underline">
                {theme === "light" ? (
                  <FaTachometerAlt className="text-black dark:text-white" />
                ) : (
                  <FaTachometerAlt className="text-white dark:text-white" />
                )}
              </button>
            </>
            
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="hover:underline">
                {theme === "light" ? (
                  <FaSignInAlt className="text-black dark:text-white" />
                ) : (
                  <FaSignInAlt className="text-white dark:text-white" />
                )}
              </button>
              <button
                onClick={() => navigate("/register-user")}
                className="hover:underline"
              >
                {theme === "light" ? (
                  <FaUserPlus className="text-black dark:text-white" />
                ) : (
                  <FaUserPlus className="text-white dark:text-white" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
       <section
        className="relative text-center py-40 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${
            theme === "dark" ? HeroImageBlack : HeroImageWhite 
          })`, 
        }}
      >
        <div className="relative z-10">
          <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : " text-black"}`}>Your Health. Our Priority.</h1>
          <p className={`text-lg mb-6 ${theme === "dark" ? "text-white" : " text-black"}`}>
            Simplify healthcare with cutting-edge solutions.
          </p>
          <button
            className={`px-6 py-3 ${theme === "light" ? "bg-black text-white" : "bg-white text-black"} rounded hover:bg-gray-200`}
            // {`px-6 py-3`}
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 flex-row space-x-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-10">Services We Provide</h2>
        <Slider {...settings} className="gap-6">
          
          {services.map((service, index) => (
            <div
              key={index}
              className={`${theme === "light" ? " bg-gray-200" : "bg-customGray"} p-6 rounded-3xl shadow-md hover:shadow-lg  transition transform hover:-translate-y-2 duration-300 mx-2`}
            >
              <h3 className={`text-xl font-semibold ${theme === "dark" ? " text-white" : "text-black"} mb-2`}>
                {service.title}
              </h3>
              <p className={`${theme === "dark" ? " text-white" : "text-black"}`}>{service.description}</p>
            </div>
          ))}
        </Slider>
      </section>
      <section className="py-20" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-10">Health & Wellness Blogs</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {blogs.map((blog, index) => (
            <div key={index} className={`${theme === "light" ? " bg-gray-200" : "bg-customGray"} p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2 duration-300 max-w-sm`}>
              <FaBookOpen className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className={`${theme === "dark" ? " text-white" : "text-black"} mb-4`}>{blog.description}</p>
              <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Read More</a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        className="relative p-12 bg-cover bg-center text-white"
        data-aos="fade-up"
       
      >
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-6 ${theme === "dark" ? " text-white" : "text-black"}`}>Have questions?</h2>
          <p className={`text-center ${theme === "dark" ? " text-white" : "text-black"} mb-8`}>
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
              <label className={`${theme === "dark" ? " text-white" : "text-black"}`}>
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
      <footer className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} py-8`}>
        <div className="text-center">
          © 2025 HealthVault. All rights reserved.
        </div>
      </footer>
      
    </div>
  );
};

export default Home;