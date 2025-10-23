import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Contact from "./pages/Contact";
import Bootcamp from "./pages/Bootcamp";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Selection from "./pages/Login/Selection";
import StudentLogin from "./pages/Login/StudentLogin";
import TeacherLogin from "./pages/Login/TeacherLogin";
import StudentHome from "./pages/StudentDashboard/StudentHome";
import StudentProfile from "./pages/StudentDashboard/StudentProfile";
import InstructorHome from "./pages/InstructorDashboard/InstructorHome";
import ForgotPassword from "./pages/StudentDashboard/ForgotPassword";
import InstructorProfile from "./pages/InstructorDashboard/InstructorProfile";
import ClassSchedule from "./pages/InstructorDashboard/ClassSchedule";
import AllClass from "./pages/StudentDashboard/AllClass";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const getUserRole = () => {
  return getCookie("userRole");
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getCookie("token");
  const userRole = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath =
      userRole === "instructor"
        ? "/instructor-dashboard"
        : "/student-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = getCookie("token");
  const userRole = getUserRole();

  if (token) {
    // Redirect to appropriate dashboard based on role
    const redirectPath =
      userRole === "instructor"
        ? "/instructor-dashboard"
        : "/student-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicRoute>
              <Contact />
            </PublicRoute>
          }
        />
        <Route
          path="/bootcamp"
          element={
            <PublicRoute>
              <Bootcamp />
            </PublicRoute>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <PublicRoute>
              <TermsAndConditions />
            </PublicRoute>
          }
        />
        <Route
          path="/refund-policy"
          element={
            <PublicRoute>
              <RefundPolicy />
            </PublicRoute>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PublicRoute>
              <PrivacyPolicy />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Selection />
            </PublicRoute>
          }
        />

        <Route
          path="/login/student"
          element={
            <PublicRoute>
              <StudentLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/login/instructor"
          element={
            <PublicRoute>
              <TeacherLogin />
            </PublicRoute>
          }
        />

        {/* Forgot Password Route */}
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <AllClass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/profile"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/class-schedule"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <ClassSchedule />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
