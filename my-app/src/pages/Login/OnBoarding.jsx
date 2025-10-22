import React, { useState } from "react";
import { FiLock, FiMail, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { requestPasswordChangeOTP, verifyOTPAndChangePassword } from "../../apiCalls/authCalls";
import { setStudentData } from "../../redux/studentSlice";
import Logo from "../../assets/images/Logo.png";
import Navbar from "../../components/BeforeLogin/Navbar";

const StudentOnboarding = ({ tempToken, enrollmentNumber, email, isFirstLogin }) => {
  const [step, setStep] = useState("welcome"); // welcome, otp-sent, verify-otp, success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleRequestOTP = async () => {
    setLoading(true);
    setError("");

    console.log('Requesting OTP with data:', {
      enrollmentNumber,
      tempToken: tempToken ? 'Token exists' : 'Token missing'
    });

    try {
      const response = await requestPasswordChangeOTP({
        enrollmentNumber,
        tempToken
      });
      console.log('OTP request successful:', response);
      setStep("otp-sent");
    } catch (err) {
      console.error('OTP request failed:', err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndChangePassword = async () => {
    // Validation
    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOTPAndChangePassword({
        enrollmentNumber,
        otp: formData.otp,
        newPassword: formData.newPassword,
        tempToken
      });

      // Store token and student data
      dispatch(setStudentData(response.student));
      
      setStep("success");
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/student-dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Welcome Step
  if (step === "welcome") {
    return (
        <>
        <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-lg" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to BRICKS! 🎉
            </h1>
            <p className="text-gray-600">
              {isFirstLogin ? "This is your first login!" : "You need to change your password"}
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
              <FiLock className="text-orange-600" />
              Security Setup Required
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Verify your email with a One-Time Password (OTP)</span>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Create a strong and secure password</span>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Access your personalized dashboard</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 text-sm text-blue-800">
              <FiMail className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">OTP will be sent to:</p>
                <p className="font-mono">{email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleRequestOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <span>Get Started</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
      </>
    );
  }

  // OTP Sent Step
  if (step === "otp-sent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <FiMail className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-600">We've sent a 6-digit OTP to</p>
            <p className="font-mono text-orange-600 font-semibold">{email}</p>
          </div>

          <button
            onClick={() => setStep("verify-otp")}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
          >
            <span>I've Received the OTP</span>
            <FiArrowRight />
          </button>

          <button
            onClick={handleRequestOTP}
            disabled={loading}
            className="w-full mt-4 text-gray-600 py-2 hover:text-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    );
  }

  // Verify OTP and Change Password Step
  if (step === "verify-otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <FiLock className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Password</h2>
            <p className="text-gray-600">Enter OTP and set your secure password</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                maxLength={6}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-2xl tracking-widest font-mono"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleVerifyAndChangePassword}
            disabled={loading || !formData.otp || !formData.newPassword || !formData.confirmPassword}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              "Complete Setup"
            )}
          </button>

          <button
            onClick={() => setStep("otp-sent")}
            className="w-full mt-4 text-gray-600 py-2 hover:text-orange-600 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Success Step
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-scale-in text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <FiCheckCircle className="text-white text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">All Set! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully changed.
            <br />
            Redirecting to your dashboard...
          </p>
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudentOnboarding;