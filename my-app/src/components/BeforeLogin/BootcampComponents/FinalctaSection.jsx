import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const FinalCtaSection = () => {
  return (
    <section className="py-12 sm:py-20 relative overflow-hidden bg-white">
      {/* Background Gradient Accent */}
      <div className="absolute inset-0 bg-white pointer-events-none"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 sm:mb-16">
            <h3 className="text-2xl sm:text-4xl lg:text-6xl font-black mb-4 sm:mb-8 text-gray-900 leading-tight">
              Ready to{" "}
              <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Your Future?
            </h3>

            <p className="text-sm sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students already building tomorrow&apos;s
              technology.{" "}
              <span className="text-orange-600 font-semibold">
                Limited seats available.
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Primary CTA */}
            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <button
                className="relative w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                onClick={() =>
                  window.open(
                    "https://payments.cashfree.com/forms/bricks-bootcamp",
                    "_blank"
                  )
                }
              >
                <span className="flex items-center justify-center">
                  SECURE YOUR SPOT NOW
                  <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-6 sm:h-6" />
                </span>
              </button>
            </div>

            {/* Secondary CTA */}
            <button
              className="w-full sm:w-auto bg-white border-2 border-orange-500 text-orange-600 px-4 py-3 sm:px-8 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-orange-50 hover:border-orange-600 transition-all duration-300 flex items-center justify-center shadow-lg"
              onClick={() =>
                window.open(
                  "https://wa.me/919871672790?text=Hi%20Bricks%20Education!%20I'm%20interested%20in%20your%20robotics%20and%20programming%20courses.",
                  "_blank"
                )
              }
            >
              <FaWhatsapp className="mr-2 sm:mr-3 w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
              Ask Questions First
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
    </section>
  );
};

export default FinalCtaSection;
