import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import Pic1 from "../../../assets/images/glimpses/Futures.jpg";
import Pic2 from "../../../assets/images/glimpses/Project.jpg";
import Pic3 from "../../../assets/images/glimpses/Guidance.jpg";
import Pic4 from "../../../assets/images/glimpses/Teamwork.jpg";
import Pic5 from "../../../assets/images/glimpses/Mentorship.jpg";
import Pic6 from "../../../assets/images/glimpses/Prize.jpg";

export default function GlimpsesSection() {
  const [activeImage, setActiveImage] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());

  const glimpses = [
    { id: 1, image: Pic1 },
    { id: 2, image: Pic4 },
    { id: 3, image: Pic3 },
    { id: 4, image: Pic2 },
    { id: 5, image: Pic5 },
    { id: 6, image: Pic6 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            setVisibleItems((prev) => new Set([...prev, parseInt(id)]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll("[data-id]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const openModal = (glimpse) => setActiveImage(glimpse);
  const closeModal = () => setActiveImage(null);

  return (
    <section className="w-full py-20 px-6 bg-[#fff8f2] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-200/10 to-yellow-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Camera className="w-4 h-4" />
            Our Gallery
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Glimpses of Our Work
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Witness the innovation, creativity, and collaborative spirit that defines our robotics workshops
          </p>
        </div>

        {/* Desktop Grid (unchanged) */}
        <div className="hidden md:grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 md:col-span-6 row-span-2" data-id={glimpses[0].id}>
            <div
              className={`group relative h-80 md:h-96 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                visibleItems.has(glimpses[0].id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              onClick={() => openModal(glimpses[0])}
            >
              <img src={glimpses[0].image} alt="Workshop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6" data-id={glimpses[1].id}>
            <div
              className={`group relative h-48 md:h-44 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                visibleItems.has(glimpses[1].id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
              onClick={() => openModal(glimpses[1])}
            >
              <img src={glimpses[1].image} alt="Team" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6" data-id={glimpses[2].id}>
            <div
              className={`group relative h-48 md:h-44 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                visibleItems.has(glimpses[2].id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
              onClick={() => openModal(glimpses[2])}
            >
              <img src={glimpses[2].image} alt="Mentoring" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4" data-id={glimpses[3].id}>
            <div
              className={`group relative h-48 md:h-60 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                visibleItems.has(glimpses[3].id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
              onClick={() => openModal(glimpses[3])}
            >
              <img src={glimpses[3].image} alt="Project" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4" data-id={glimpses[4].id}>
            <div
              className={`group relative h-48 md:h-60 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                visibleItems.has(glimpses[4].id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "400ms" }}
              onClick={() => openModal(glimpses[4])}
            >
              <img src={glimpses[4].image} alt="Innovation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4" data-id={glimpses[5].id}>
            <div
              className={`group relative h-48 md:h-60 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                visibleItems.has(glimpses[5].id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "500ms" }}
              onClick={() => openModal(glimpses[5])}
            >
              <img src={glimpses[5].image} alt="Competition" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="flex md:hidden space-x-4 overflow-x-auto scrollbar-hide">
          {glimpses.map((glimpse) => (
            <div
              key={glimpse.id}
              className="flex-shrink-0 w-64 h-40 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => openModal(glimpse)}
            >
              <img
                src={glimpse.image}
                alt={`Gallery ${glimpse.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              ✕
            </button>
            <img
              src={activeImage.image}
              alt="Gallery Image"
              className="w-full h-auto max-h-[90vh] object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
}
