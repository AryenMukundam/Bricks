import React from "react";
import Banner from "../components/BeforeLogin/HomeComponents/Banner";
import Aboutus from "../components/BeforeLogin/HomeComponents/Aboutus";
import Testimonials from "../components/BeforeLogin/HomeComponents/Testimonials";
import { HomeProvider } from "../context/Homecontext";
import LoadingScreen from "../components/BeforeLogin/HomeComponents/LoadingScreen";
import Partner from "../components/BeforeLogin/HomeComponents/Partner";
import SchoolTestimonials from "../components/BeforeLogin/HomeComponents/SchoolTestimonials";
import Workshop from "../components/BeforeLogin/HomeComponents/Workshop";
import Outcomes from "../components/BeforeLogin/HomeComponents/Outcomes";
import Provide from "../components/BeforeLogin/HomeComponents/Provide";
import Glimpses from "../components/BeforeLogin/HomeComponents/Glimpses";
import Navbar from "../components/BeforeLogin/Navbar";
import Footer from "../components/BeforeLogin/Footer";


function Home() {
  return (
    <HomeProvider>
      <LoadingScreen />
      <main>
        <Navbar/>
        <Banner />
        <Aboutus />

        <Testimonials />
        <Partner/>
        
        <Workshop/>
        <Glimpses/>
        <Outcomes/>
        <SchoolTestimonials/>
        <Provide/>
        <Footer/>
        
        

      </main>
    </HomeProvider>
  );
}

export default Home;
