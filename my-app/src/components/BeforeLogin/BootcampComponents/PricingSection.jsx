import {
  CheckCircle,
  Users,
  Zap,
  Gift,
  Trophy,
  Cpu,
  Wrench,
  Shield,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import roboticsKitImage from "../../../assets/images/robotics-kit.jpg";

const PricingSection = () => {
  const commonFeatures = [
    "All program benefits included",
    <span key="kit">
      <strong>Free robotics kit worth ₹4000</strong>
    </span>,
    "Priority mentor access & guidance",
    "Exclusive alumni network access",
    "Certificate from Google & Scaler",
    "Live project demonstrations",
    "Career guidance sessions",
  ];

  const kitFeatures = [
    {
      icon: Cpu,
      title: "Arduino Board",
      description: "Latest microcontroller for programming",
    },
    {
      icon: Zap,
      title: "Sensors & Motors",
      description: "Complete sensor suite and servo motors",
    },
    {
      icon: Wrench,
      title: "Building Components",
      description: "Wires, breadboard, and connectors",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "All components are student-safe",
    },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-20 bg-[#fff8f2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Limited Time Offer
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 text-slate-900 leading-tight">
            Choose Your
            <span className="block text-orange-500">Learning Path</span>
          </h2>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of students building the future with robotics and
            programming
          </p>
        </div>

        {/* Pricing Cards */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-14 sm:mb-20 max-w-6xl mx-auto">
  {/* Winner Tier Card */}
  <div className="relative">
    {/* Popular Badge */}
    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg z-10">
      🏆 MOST POPULAR
    </div>

    <div className="bg-white border-2 sm:border-4 border-orange-500 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 h-full shadow-xl lg:shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-orange-500/5 rounded-full -translate-y-10 sm:-translate-y-16 lg:-translate-y-20 translate-x-10 sm:translate-x-16 lg:translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-orange-500/5 rounded-full translate-y-8 sm:translate-y-12 lg:translate-y-16 -translate-x-8 sm:-translate-x-12 lg:-translate-x-16"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Trophy className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Workshop Winners
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600">
              For competition participants
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900">
              ₹1,999
            </span>
            <span className="text-lg sm:text-2xl lg:text-3xl text-slate-400 line-through">
              ₹5,999
            </span>
          </div>
          <div className="inline-block bg-green-100 text-green-700 px-2 sm:px-3 lg:px-4 py-1 rounded-full text-xs sm:text-sm lg:text-base font-semibold">
            Save ₹4,000 (67% OFF)
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg lg:text-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 mb-6 shadow-lg lg:shadow-xl"
          onClick={() =>
            window.open(
              "https://payments.cashfree.com/forms/bricks-bootcamp",
              "_blank"
            )
          }
        >
          Get Started Now
          <ArrowRight className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 inline-block ml-2" />
        </button>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h4 className="font-semibold text-slate-900 mb-2 sm:mb-3 lg:mb-4">
            Everything included:
          </h4>
          {commonFeatures.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <CheckCircle className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-orange-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm lg:text-base text-slate-700">
                {feature}
              </span>
            </div>
          ))}
          <div className="text-orange-600 text-xs sm:text-sm lg:text-base font-medium">
            + 3 more benefits
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Partner Schools Card */}
  <div className="bg-white border border-slate-200 sm:border-2 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 h-full shadow-lg lg:shadow-2xl relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-20 sm:w-28 lg:w-36 h-20 sm:h-28 lg:h-36 bg-slate-100 rounded-full -translate-y-10 sm:-translate-y-14 lg:-translate-y-18 translate-x-10 sm:translate-x-14 lg:translate-x-18"></div>
    <div className="absolute bottom-0 left-0 w-16 sm:w-20 lg:w-28 h-16 sm:h-20 lg:h-28 bg-slate-100 rounded-full translate-y-8 sm:translate-y-10 lg:translate-y-14 -translate-x-8 sm:-translate-x-10 lg:-translate-x-14"></div>

    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-slate-600 rounded-lg sm:rounded-xl flex items-center justify-center">
          <Users className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900">
            Partner Schools
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600">
            For institutional students
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900">
            ₹3,499
          </span>
          <span className="text-lg sm:text-2xl lg:text-3xl text-slate-400 line-through">
            ₹5,999
          </span>
        </div>
        <div className="inline-block bg-blue-100 text-blue-700 px-2 sm:px-3 lg:px-4 py-1 rounded-full text-xs sm:text-sm lg:text-base font-semibold">
          Save ₹2,500 (42% OFF)
        </div>
      </div>

      <button
        className="w-full bg-slate-900 text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg lg:text-xl hover:bg-slate-800 transition-all duration-300 mb-6 shadow-lg lg:shadow-xl"
        onClick={() =>
          window.open(
            "https://payments.cashfree.com/forms/bricks-bootcamp",
            "_blank"
          )
        }
      >
        Get Started Now
        <ArrowRight className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 inline-block ml-2" />
      </button>

      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        <h4 className="font-semibold text-slate-900 mb-2 sm:mb-3 lg:mb-4">
          Everything included:
        </h4>
        {commonFeatures.slice(0, 4).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <CheckCircle className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-slate-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm lg:text-base text-slate-700">
              {feature}
            </span>
          </div>
        ))}
        <div className="text-slate-600 text-xs sm:text-sm lg:text-base font-medium">
          + 3 more benefits
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Features Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl mb-14 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Complete Learning Experience
            </h3>
            <p className="text-sm sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Both plans include all these premium features to ensure your
              success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {commonFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-[#fff8f2] rounded-xl sm:rounded-2xl border border-[#fff8f2]"
              >
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-base text-slate-900 font-medium">
                    {feature}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-10 sm:mt-12 text-center">
            <button
              className="inline-flex items-center gap-2 sm:gap-3 bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg"
              onClick={() =>
                window.open(
                  "https://wa.me/919871672790?text=Hi%20Bricks%20Education!%20I'm%20interested%20in%20your%20robotics%20and%20programming%20courses.",
                  "_blank"
                )
              }
            >
              <FaWhatsapp className="w-5 sm:w-6 h-5 sm:h-6" />
              Have Questions? Chat with Us
            </button>
          </div>
        </div>

        {/* Kit Section - Compact on Mobile */}
<div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
  <div className="grid grid-cols-1 lg:grid-cols-2">
    {/* Kit Info */}
    <div className="p-4 sm:p-8 lg:p-12 text-white">
      <div className="mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-500/20 text-green-300 px-2 sm:px-4 py-0.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium mb-3 sm:mb-6">
          <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
          FREE with Every Plan
        </div>
        <h2 className="text-xl sm:text-3xl lg:text-5xl font-black mb-2 sm:mb-4">
          Professional
          <span className="block text-green-400">Robotics Kit</span>
        </h2>
        <p className="text-xs sm:text-base lg:text-xl text-slate-300 mb-3 sm:mb-6">
          Worth ₹4,000 - Yours free with any plan. Start building from day one!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
        {kitFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white/10 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-xs sm:text-base">
                {feature.title}
              </h4>
              <p className="text-slate-400 text-[10px] sm:text-sm">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Kit Image */}
    <div className="relative p-4 sm:p-8 lg:p-12 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
        <img
          src={roboticsKitImage}
          alt="Professional Robotics Kit"
          className="relative rounded-xl sm:rounded-2xl w-full max-w-[200px] sm:max-w-sm lg:max-w-md shadow-2xl"
        />
        <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-green-500 text-white px-2 sm:px-4 py-0.5 sm:py-2 rounded-full font-bold text-[10px] sm:text-sm">
          FREE
        </div>
      </div>
    </div>
  </div>
</div>

      </div>
    </section>
  );
};

export default PricingSection;
