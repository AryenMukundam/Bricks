import React from "react";
import teamPhoto from "../../../assets/images/Team.jpg";

const AboutUs = () => {
  return (
    <div className="bg-[#fff8f2] border-b border-[#f3e5d8] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-600 text-center md:text-left">
              Who We Are?
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-base leading-relaxed text-center md:text-left">
              At <span className="font-bold text-orange-600">BRICKS</span>, we
              are a team of young{" "}
              <span className="font-bold text-orange-600">innovators</span>,{" "}
              <span className="font-bold text-orange-600">educator</span>, and{" "}
              <span className="font-bold text-orange-600">builder</span> who
              believe the classroom should prepare students not just for{" "}
              <span className="font-bold text-orange-600">exams</span>, but for{" "}
              <span className="font-bold text-orange-600">life</span>. With
              experience ranging from building grassroots startups to running
              real-world learning programs in
              <span className="font-bold text-orange-600"> schools</span>, we
              bring unmatched{" "}
              <span className="font-bold text-orange-600">energy</span>,
              relevance, and creativity to everything we do. Our mission is
              simple: to turn curiosity into capability and students into
              <span className="font-bold text-orange-600">
                {" "}
                future-ready thinkers
              </span>
              . We create hands-on, highly engaging{" "}
              <span className="font-bold text-orange-600">workshops</span> that
              blend AI, coding, robotics, career exposure, and public speaking
              all in a format that's fun, challenging, and unforgettable. Every
              student we work with doesn't just learn, they explore,
              collaborate, question, and build. Because at{" "}
              <span className="font-bold text-orange-600">BRICKS</span>, we
              don't just teach. We spark futures.
            </p>
          </div>

          {/* Image */}
          <div className="py-4 sm:py-6 md:py-4 flex items-center justify-center order-1 md:order-2">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg group">
              <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl sm:rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>

              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg group-hover:shadow-xl transition-all duration-500">
                <img
                  src={teamPhoto}
                  alt="BRICKS team group photo with building blocks"
                  className="w-full h-auto rounded-xl sm:rounded-2xl object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{ aspectRatio: "4/3" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;