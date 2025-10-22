import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Sparkles, ArrowRight } from "lucide-react";
import Navbar from "../components/BeforeLogin/Navbar";
import Footer from "../components/BeforeLogin/Footer";

const Contact = () => {
  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 font-sans min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">

        {/* Contact Info */}
        <section className="bg-[#fff8f2] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-orange-500 mb-6 flex items-center">
            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full mr-4"></div>
            Contact Information
          </h2>

          <address className="not-italic space-y-3">
            <div className="flex items-center p-3 bg-[#fff8f2] rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mr-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
              </svg>
              <a href="tel:+919462311937" className="text-black hover:text-orange-600 hover:underline transition-colors">
                +91 94623 11937
              </a>
            </div>

            <div className="flex items-center p-3 bg-[#fff8f2] rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mr-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
              <a href="mailto:schoolsupport@bricks.org.in" className="text-black hover:text-orange-600 hover:underline transition-colors">
                schoolsupport@bricks.org.in
              </a>
            </div>

            <div className="flex items-center p-3 bg-[#fff8f2] rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mr-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.36,14C16.44,13.3 16.5,12.61 16.5,12C16.5,11.39 16.44,10.7 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.32 9.5,12.66 9.5,12C9.5,11.34 9.56,10.68 9.66,10H14.34C14.44,10.68 14.5,11.34 14.5,12C14.5,12.66 14.44,13.32 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.7 7.5,11.39 7.5,12C7.5,12.61 7.56,13.3 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <a href="http://www.bricks.org.in" target="_blank" rel="noopener noreferrer" className="text-black hover:text-orange-600 hover:underline transition-colors">
                www.bricks.org.in
              </a>
            </div>
          </address>
        </section>

        {/* Action Buttons */}
        <section className="bg-[#fff8f2] p-6 md:p-12 rounded-3xl shadow-xl mb-12 border border-gray-100">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are already building their future with robotics and programming
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center">
            <button
              className="flex items-center justify-center w-full md:w-auto gap-3 md:gap-4 bg-green-500 hover:bg-green-600 text-white px-6 md:px-10 py-4 md:py-6 rounded-2xl font-bold text-lg md:text-xl shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
              onClick={() => window.open("https://wa.me/919871672790?text=Hi%20Bricks%20Education!%20I'm%20interested%20in%20your%20robotics%20and%20programming%20courses.", "_blank")}
            >
              <FaWhatsapp className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
              Have Questions? Chat with Us
            </button>

            <button
              className="flex items-center justify-center w-full md:w-auto gap-3 md:gap-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 md:px-12 py-4 md:py-6 rounded-2xl font-bold text-lg md:text-xl shadow-xl hover:shadow-2xl hover:shadow-orange-300 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
              onClick={() => window.open("https://payments.cashfree.com/forms/bricks-bootcamp", "_blank")}
              aria-label="Enroll now in the bootcamp"
            >
              <Sparkles className="w-6 md:w-8 h-6 md:h-8" />
              ENROLL NOW
              <ArrowRight className="w-6 md:w-8 h-6 md:h-8 ml-2 md:ml-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Contact;