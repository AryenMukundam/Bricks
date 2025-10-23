import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Home,
  CreditCard,
  Package,
  TrendingUp,
  X,
  LogOut,
  AlertCircle,
} from "lucide-react";
import Logo from "../../assets/images/Logo.png";
import { studentlogout } from "../../apiCalls/authCalls";
import { studentLogout } from "../../redux/studentSlice";
import { persistor } from "../../redux/store";

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-orange-600" size={32} />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Confirm Logout
          </h3>

          <p className="text-gray-600 mb-6">
            Are you sure you want to logout? You'll need to sign in again to
            access your dashboard.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Logging out...</span>
                </>
              ) : (
                "Yes, Logout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      await studentlogout();
      deleteCookie("token");
      deleteCookie("userRole");
      dispatch(studentLogout());
      await persistor.purge();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="shadow-lg backdrop-blur-sm bg-white/90 sticky top-0 z-40">
        <div className="w-full py-3 px-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center space-x-3 group hover:opacity-95 transition-all duration-300"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <img
                  className="h-12 w-auto object-contain"
                  src={Logo}
                  alt="BricksEducation Logo"
                />
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide hidden sm:block">
                  <span className="text-slate-800 group-hover:text-slate-700 transition-colors">
                    Bricks{" "}
                  </span>
                  <span className="text-orange-500 group-hover:text-orange-600 transition-colors">
                    Education
                  </span>
                </h1>
              </button>
            </div>

            <div className="flex items-center space-x-10">
              <Link
                to="/student/profile"
                className="text-lg text-gray-700 font-medium hover:text-orange-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-700"
              >
                Profile
              </Link>
              <button
                onClick={handleLogoutClick}
                className="flex items-center space-x-2 text-lg text-gray-700 font-medium hover:text-orange-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-700"
              >
                <span>Logout</span>
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-50 w-90 bg-white h-screen flex flex-col border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={Logo}
                alt="BricksEducation Logo"
                className="h-10 w-auto"
              />
              <p className="text-xl md:text-2xl font-bold tracking-wide hidden sm:block">
                <span className="text-slate-800">Bricks </span>
                <span className="text-orange-500">Education</span>
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col space-y-2 mt-6">
            <a
              href="/dashboard"
              className="flex items-center space-x-4 px-4 py-2.5 text-gray-600 hover:bg-orange-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <Home size={24} />
              <span>Home</span>
            </a>
            <a
              href="/classes"
              className="flex items-center space-x-4 px-4 py-2.5 text-gray-600 hover:bg-orange-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <CreditCard size={24} />
              <span>Class</span>
            </a>
            
            
          </nav>

          <div className="flex-grow"></div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLogoutClick}
            className="flex items-center space-x-4 px-4 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
}

export default Navbar;
