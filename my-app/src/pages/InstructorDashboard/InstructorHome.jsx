import React from 'react'
import Navbar from '../../components/InstructorDashboard/Navbar'
import ClassScheduler from '../../components/InstructorDashboard/HomeComponents/ClassScheduler'

function InstructorHome() {
  return (
    <>
    <Navbar/>
    <ClassScheduler/>
    </>
  )
}

export default InstructorHome