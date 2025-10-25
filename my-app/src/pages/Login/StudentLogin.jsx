import React, { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiX,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import Logo from "../../assets/images/Logo.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/BeforeLogin/Navbar";
import { studentlogin } from "../../apiCalls/authCalls";
import { useDispatch } from "react-redux";
import { setStudentData } from "../../redux/studentSlice";
import StudentOnboarding from "./StudentOnboarding";

const setCookie = (name, value) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Error Modal Component
const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="text-red-600" size={32} />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Sign In Failed
          </h3>

          <p className="text-gray-600 mb-6">
            {message ||
              "Invalid credentials. Please check your enrollment number and password."}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

function StudentLogin() {
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  // State for onboarding flow
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!enrollmentNumber || !password) {
      setError("Please fill in all the details");
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const student = { enrollmentNumber, password };
      const response = await studentlogin(student);
      console.log("Student Sign In Response:", response);

      if (response.mustChangePassword) {
        console.log("Password change required - showing onboarding");
        setOnboardingData({
          tempToken: response.tempToken,
          enrollmentNumber: response.enrollmentNumber,
          email: response.email,
          isFirstLogin: response.isFirstLogin,
        });
        setShowOnboarding(true);
        setIsLoading(false);
        return;
      }
      console.log("Normal login successful");
      if (response.token) {
        setCookie("token", response.token);
      }
      setCookie("userRole", "student");
      dispatch(setStudentData(response.student));
      navigate("/student-dashboard");

      setEnrollmentNumber("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (showOnboarding && onboardingData) {
    return (
      <StudentOnboarding
        tempToken={onboardingData.tempToken}
        enrollmentNumber={onboardingData.enrollmentNumber}
        email={onboardingData.email}
        isFirstLogin={onboardingData.isFirstLogin}
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f2] flex items-center justify-center p-4">
        <div className="grid md:grid-cols-2 max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 p-12 text-white rounded-tr-[5rem] rounded-br-[5rem]">
            <h1 className="text-4xl font-bold mb-3">Welcome Back!</h1>
            <p className="text-center text-lg opacity-90">
              Sign in to access your student dashboard.
            </p>
          </div>

          <div className="p-8 md:p-12 w-full">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
            >
              <FiArrowLeft size={20} />
              <span>Back to selection</span>
            </button>

            <div className="flex justify-center mb-6">
              <img
                src={Logo}
                alt="Company Logo"
                className="w-24 h-auto rounded-md"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              <span className="text-orange-600">Student</span> Login
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiMail />
                </div>
                <input
                  type="text"
                  id="enrollmentNumber"
                  placeholder="Enter your Enrollment Number"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-orange-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>

        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          message={error}
        />
      </div>
    </>
  );
}

export default StudentLogin;
