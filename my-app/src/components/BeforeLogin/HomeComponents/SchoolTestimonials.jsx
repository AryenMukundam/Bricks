import React from "react";

// Import testimonial images
import principal1 from "../../../assets/images/schooltestimonials/Pic1.jpg";
import principal2 from "../../../assets/images/schooltestimonials/Pic3.jpg";
import teacher1 from "../../../assets/images/schooltestimonials/Pic2.jpg";

export default function SchoolTestimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Rajkumar Kadyan",
      position: "Principal - Vidyashram Public School",
      image: principal1,
      testimonial:
        "The way Bricks teach real-world tech skills is mind-blowing! Their administration and conduct are superb.",
    },
    {
      id: 2,
      name: "Sunita Kunwar",
      position: "Principal - MG Government School",
      image: principal2,
      testimonial:
        "Students today are lacking such valuable skills, and what Bricks is teaching them is truly great.",
    },
    {
      id: 3,
      name: "Nikita Sharma",
      position: "Science Teacher - Radha Krishna School",
      image: teacher1,
      testimonial:
        "The workshop kept students so engaged that they were automatically disciplined. They learned a lot while having fun!",
    },
  ];

  return (
    <section className="bg-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-wide mb-2 block">
            Educator Testimonials
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            What Educators Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by schools and teachers across India
          </p>
        </div>

        {/* Responsive Layout */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible scrollbar-hide">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-[85%] sm:min-w-[70%] md:min-w-0 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 snap-center"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <svg
                    className="w-6 h-6 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-sm leading-relaxed italic mb-4">
                  "{testimonial.testimonial}"
                </p>

                {/* Profile Info */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-orange-600 text-sm font-medium">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
