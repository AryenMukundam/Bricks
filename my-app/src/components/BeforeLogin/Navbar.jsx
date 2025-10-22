import React, { useState } from "react";
import logo from "../../assets/images/Logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="shadow-lg backdrop-blur-sm">
      <div className="w-full py-3 px-10">
        {" "}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-3 group hover:opacity-95 transition-all duration-300"
          >
            <img
              className="w-13 h-13 object-contain drop-shadow-sm"
              src={logo}
              alt="BricksEducation Logo"
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              <span className="text-slate-800 group-hover:text-slate-700 transition-colors">
                Bricks
              </span>
              <span className="text-orange-500 group-hover:text-orange-600 transition-colors">
                Education
              </span>
            </h1>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              to="/"
              className="text-lg text-gray-700 font-medium hover:text-orange-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-700"
            >
              Home
            </Link>
            <Link
              to="/bootcamp"
              className="text-lg text-gray-700 font-medium hover:text-orange-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-700"
            >
              Bootcamp
            </Link>

            <Link
              to="/contact"
              className="text-lg text-gray-700 font-medium hover:text-orange-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-700"
            >
              Contact
            </Link>

            {/* Contact Button */}
            <div className="flex justify-center items-center">
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#ff7b00] to-[#ff4500] text-white font-medium px-5 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-6 pb-4 space-y-4 border-t border-gray-200 mt-4">
            <Link
              to="/"
              className="block text-lg text-gray-700 font-medium hover:text-orange-500 transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/bootcamp"
              className="block text-lg text-gray-700 font-medium hover:text-orange-500 transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Bootcamp
            </Link>
            <Link
              to="/contact"
              className="block text-lg text-gray-700 font-medium hover:text-orange-500 transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-[#ff7b00] to-[#ff4500] text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
