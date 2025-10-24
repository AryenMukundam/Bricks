import React from "react";
import Navbar from "../../components/StudentDashboard/Navbar.jsx";
import Class from "../../components/StudentDashboard/HomeComponents/Class.jsx"
import AssignmentsOverview from "../../components/StudentDashboard/HomeComponents/RecentAssignments.jsx";

function StudentHome() {
  return (
    <>
      <Navbar />
      <Class />
      <AssignmentsOverview />
    </>
  );
}

export default StudentHome;
