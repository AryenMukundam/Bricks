import React from "react";
import BannerImg from "../../../assets/images/Banner.jpg";

function Banner() {
  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[90vh] w-full mt-1 px-4 sm:px-0">
      {/* Banner Image with reduced opacity */}
      <div
        className="h-full w-full bg-cover bg-center opacity-100 rounded-lg sm:rounded-2xl"
        style={{
          backgroundImage: `url(${BannerImg})`,
        }}
      ></div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold text-center drop-shadow-lg leading-tight">
          Build.<span className="text-[#e74c3c]">Think.</span>Lead.
        </h1>
      </div>
    </div>
  );
}

export default Banner;