import React from 'react'
import Navbar from '../../components/InstructorDashboard/Navbar'
import ClassScheduler from '../../components/InstructorDashboard/HomeComponents/ClassScheduler'
import AssignmentScheduler from '../../components/InstructorDashboard/HomeComponents/AssignmentScheduler'

function InstructorHome() {
  return (
    <>
    <Navbar/>
    <ClassScheduler/>
    <AssignmentScheduler/>
    </>
  )
}

export default InstructorHome