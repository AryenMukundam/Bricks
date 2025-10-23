import React from "react";
import Navbar from "../../components/StudentDashboard/Navbar.jsx";
import Class from "../../components/StudentDashboard/HomeComponents/Class.jsx"
import Practise from "../../components/StudentDashboard/HomeComponents/Practise.jsx";
import Footer from "../../components/StudentDashboard/Footer.jsx";

function StudentHome() {
  return (
    <>
      <Navbar />
      <Class />
      <Practise />
    </>
  );
}

export default StudentHome;
