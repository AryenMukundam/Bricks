import React from "react";
import Pic1 from "../../../assets/images/testimonials/Pic1.jpg";
import Pic2 from "../../../assets/images/testimonials/Pic2.jpg";
import Pic3 from "../../../assets/images/testimonials/Pic3.jpg";
import Pic4 from "../../../assets/images/testimonials/Pic4.jpg";

const Testimonials = () => {
  const legends = [
    {
      id: 1,
      name: "Anshuman Singh",
      title: "Co-Founder & CEO",
      company: "Scaler Academy",
      image: Pic1,
      description:
        "Technology leader with deep expertise in building scalable systems.",
      linkedIn: "https://www.linkedin.com/in/anshumansingh26/",
    },
    {
      id: 2,
      name: "Abhimanyu Saxena",
      title: "Co-Founder",
      company: "Scaler Academy",
      image: Pic3,
      description:
        "Serial entrepreneur and tech visionary in education technology.",
      linkedIn: "https://www.linkedin.com/in/abhimanyusaxena/",
    },
    {
      id: 3,
      name: "Prasanna Sankar",
      title: "Co-Founder",
      company: "Rippling",
      image: Pic2,
      description:
        "Entrepreneur who scaled multiple technology companies to IPO.",
      linkedIn: "https://www.linkedin.com/in/myprasanna/",
    },
    {
      id: 4,
      name: "Manmeet Singh Akali",
      title: "Vice President",
      company: "Scaler School of Technology",
      image: Pic4,
      description: "EdTech leader who scaled Scaler from $6M to $65M revenue.",
      linkedIn: "https://www.linkedin.com/in/manmeetakali/",
    },
  ];

  return (
    <div className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Testimonials from <span className="text-orange-500">Leaders</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from industry experts backing our vision and mission
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legends.map((legend) => (
            <div
              key={legend.id}
              className="bg-[#fff8f2] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Profile */}
              <div className="flex items-center mb-4">
                <img
                  src={legend.image}
                  alt={legend.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {legend.name}
                  </h3>
                  <p className="text-orange-500 text-sm font-medium">
                    {legend.title}
                  </p>
                  <p className="text-gray-500 text-xs">{legend.company}</p>
                </div>
              </div>

              {/* Feedback */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                “{legend.description}”
              </p>

              {/* LinkedIn */}
              <a
                href={legend.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-4 h-4 fill-current mr-2"
                >
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8 0 24.1 24.09-.5 53.79-.5s53.79 24.6 53.79 54.3c0 29.7-24.09 53.8-53.79 53.8zM447.9 448h-92.4V304.1c0-34.3-.7-78.3-47.7-78.3-47.7 0-55 37.3-55 75.9V448h-92.4V148.9h88.7v40.8h1.3c12.4-23.5 42.7-48.3 87.8-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                </svg>
                Connect
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
