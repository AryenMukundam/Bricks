import React, { useState, useEffect } from "react";

export default function Provide() {
  const [activeItem, setActiveItem] = useState(0);

  const provides = [
    {
      id: "01",
      title: "Starter Robotics Kit",
      desc: "Includes an Arduino board, chassis, motors, sensors, breadboard, batteries, wires — everything needed to build and program a robot from scratch.",
      details: [
        "Arduino Uno Board",
        "DC Motors & Wheels",
        "Ultrasonic Sensors",
        "Jumper Wires & Breadboard",
      ],
      colors: {
        border: "border-orange-500",
        bg: "bg-orange-50",
        text: "text-orange-600",
        dot: "bg-orange-500",
        cardBorder: "border-orange-200",
      },
    },
    {
      id: "02",
      title: "Workshop Handbook & Learning Guides",
      desc: "Laptops, project sheets, and creative challenges to support learning during and after the workshop.",
      details: [
        "Individual Laptops",
        "Step-by-step Guides",
        "Project Templates",
        "Take-home Resources",
      ],
      colors: {
        border: "border-blue-500",
        bg: "bg-blue-50",
        text: "text-blue-600",
        dot: "bg-blue-500",
        cardBorder: "border-blue-200",
      },
    },
    {
      id: "03",
      title: "Mentor Support",
      desc: "A dedicated team of trained mentors will guide teams, answer questions, and ensure an engaging learning environment.",
      details: [
        "1:6 Mentor Ratio",
        "Industry Experts",
        "Live Troubleshooting",
        "Career Guidance",
      ],
      colors: {
        border: "border-green-500",
        bg: "bg-green-50",
        text: "text-green-600",
        dot: "bg-green-500",
        cardBorder: "border-green-200",
      },
    },
    {
      id: "04",
      title: "Certificates & Prizes",
      desc: "All participants receive a certificate of completion. Winners of Robo Races & Shark Tank Pitches take home exclusive BRICKS goodies.",
      details: [
        "Digital Certificates",
        "Winner Medals",
        "BRICKS Merchandise",
        "Achievement Badges",
      ],
      colors: {
        border: "border-purple-500",
        bg: "bg-purple-50",
        text: "text-purple-600",
        dot: "bg-purple-500",
        cardBorder: "border-purple-200",
      },
    },
  ];

  // Auto cycle only on desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    if (!mq.matches) return;

    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % provides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-16 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-4 block">
            WHAT WE PROVIDE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-orange-500">Package</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything your team needs for an exceptional learning journey
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Nav */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-2">
              {provides.map((item, index) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveItem(index)}
                  onClick={() => setActiveItem(index)}
                  className={`cursor-pointer border-l-4 pl-4 py-4 transition-all ${
                    activeItem === index
                      ? `${item.colors.border} ${item.colors.bg}`
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <h3
                    className={`font-semibold ${
                      activeItem === index ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {item.id}. {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 relative min-h-[350px]">
            {provides.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-700 ${
                  activeItem === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6 pointer-events-none"
                }`}
              >
                <div
                  className={`bg-white border ${item.colors.cardBorder} rounded-xl p-8 shadow-lg`}
                >
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-700 mb-6">{item.desc}</p>
                  <ul className="grid grid-cols-2 gap-3">
                    {item.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 text-sm ${item.colors.bg} px-3 py-2 rounded-md`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${item.colors.dot}`}
                        ></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="grid gap-8 lg:hidden">
          {provides.map((item) => (
            <div
              key={item.id}
              className={`bg-white border ${item.colors.cardBorder} rounded-xl p-6 shadow`}
            >
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-700 mb-4">{item.desc}</p>
              <ul className="space-y-2">
                {item.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-2 text-sm ${item.colors.bg} px-3 py-2 rounded-md`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${item.colors.dot}`}
                    ></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
