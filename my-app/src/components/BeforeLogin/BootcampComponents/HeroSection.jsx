import { Sparkles, Rocket, Zap, ArrowRight, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-200 animate-pulse"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#f97316" fill-opacity="0.1"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>'
            )}")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-30 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight sm:leading-none tracking-tight text-gray-800 drop-shadow-lg">
            BRICKS Innovation
            <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent mt-3 sm:mt-4">
              Bootcamp
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-4 sm:mb-6 drop-shadow-md">
            "Become the Top 0.1% — the Builders, Thinkers, and Future Leaders."
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium text-gray-600">
            You can be the one or you will be left behind. This is your chance
            to interact with
            <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent font-black mx-1 sm:mx-2">
              Anshuman Singh , Abhimanyu Saxena
            </span>
            and industry legends!
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/40 backdrop-blur-lg border border-orange-200 rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-100">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              <span className="font-bold text-sm sm:text-lg text-gray-700">
                Starting Soon!
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/40 backdrop-blur-lg border border-orange-200 rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-100">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              <span className="font-bold text-sm sm:text-lg text-gray-700">
                2 Classes/Week, 60 mins
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/40 backdrop-blur-lg border border-orange-200 rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-100">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              <span className="font-bold text-sm sm:text-lg text-gray-700">
                Limited Seats Only
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button
              className="w-full sm:w-auto px-8 sm:px-10 md:px-12 lg:px-16 py-4 sm:py-5 md:py-6 lg:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl sm:rounded-2xl border-none transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
              onClick={() =>
                window.open(
                  "https://payments.cashfree.com/forms/bricks-bootcamp",
                  "_blank"
                )
              }
            >
              <Sparkles className="mr-2 sm:mr-3 md:mr-4 lg:mr-5 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              ENROLL NOW
              <ArrowRight className="ml-2 sm:ml-3 md:ml-4 lg:ml-5 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
