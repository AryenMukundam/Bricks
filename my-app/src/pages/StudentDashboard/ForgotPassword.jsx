import React, { useState } from "react";
import { FiLock, FiMail, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { forgotPassword, resetPassword } from "../../apiCalls/authCalls";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    enrollmentNumber: "",
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleRequestOTP = async () => {
    if (!formData.enrollmentNumber || formData.enrollmentNumber.length < 5) {
      setError("Please enter a valid enrollment number");
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await forgotPassword({
        enrollmentNumber: formData.enrollmentNumber,
        email: formData.email
      });
      
      console.log('OTP sent successfully:', response);
      setStep("otp-sent");
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || "Failed to send OTP. Please verify your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
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
      const response = await resetPassword({
        enrollmentNumber: formData.enrollmentNumber,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      
      console.log('Password reset successful:', response);
      setStep("success");
      
      setTimeout(() => {
        navigate("/login/student");
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Request OTP Step
  if (step === "request") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiLock className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600">
              Enter your details to reset your password
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-start gap-2">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Number
              </label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleInputChange}
                placeholder="Enter your enrollment number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your registered email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 text-sm text-orange-900">
              <FiMail className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>We'll send a 6-digit OTP to your registered email address to verify your identity.</p>
            </div>
          </div>

          <button
            onClick={handleRequestOTP}
            disabled={loading || !formData.enrollmentNumber || !formData.email}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <span>Send OTP</span>
                <FiArrowRight />
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/login/student')}
            className="w-full text-gray-600 py-2 font-medium flex items-center justify-center gap-2"
          >
            <FiArrowLeft />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    );
  }

  // OTP Sent Step
  if (step === "otp-sent") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <FiMail className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-1">We've sent a 6-digit OTP to</p>
            <p className="font-mono text-orange-600 font-semibold">{formData.email}</p>
          </div>

          <button
            onClick={() => setStep("verify-otp")}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <span>I've Received the OTP</span>
            <FiArrowRight />
          </button>

          <button
            onClick={handleRequestOTP}
            disabled={loading}
            className="w-full mt-4 text-gray-600 py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>

          <button
            onClick={() => setStep("request")}
            className="w-full mt-2 text-gray-600 py-2 font-medium flex items-center justify-center gap-2"
          >
            <FiArrowLeft />
            <span>Change Details</span>
          </button>
        </div>
      </div>
    );
  }

  // Verify OTP and Reset Password Step
  if (step === "verify-otp") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <FiLock className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter OTP and create your new password</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-start gap-2">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <div className="space-y-5 mb-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading || !formData.otp || !formData.newPassword || !formData.confirmPassword}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Resetting Password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <button
            onClick={() => setStep("otp-sent")}
            className="w-full text-gray-600 py-2 font-medium"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6">
            <FiCheckCircle className="text-white text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been changed successfully.
            <br />
            Redirecting to login page...
          </p>
          <div className="flex justify-center">
            <svg className="h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

export default ForgotPassword;