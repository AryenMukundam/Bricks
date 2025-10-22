import React, { useState } from "react";
import {
  Shield,
  ChevronDown,
  ChevronUp,
  Phone,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/BeforeLogin/Navbar";
import Footer from "../components/BeforeLogin/Footer";

const RefundPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections = [
    {
      id: "no-refunds",
      title: "No Refunds Under Any Circumstances",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base">
          <p>
            All fees paid are <strong className="text-red-600">non-refundable</strong> once enrollment is confirmed and robotics kit is distributed.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-gray-900 mb-2">This includes:</h4>
            <ul className="space-y-1">
              {[
                "Course registration fees",
                "Tuition payments",
                "Material fees",
                "Workshop fees",
                "Summer camp fees",
                "Value of provided robotics kits"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF5722] mt-1 flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "enrollment-confirmation",
      title: "Enrollment Confirmation and Kit Distribution",
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          Payment of fees constitutes enrollment confirmation. Once payment is processed and the robotics kit is provided, the no-refund policy takes <strong className="text-blue-600">immediate effect</strong>. Students retain ownership of their kit regardless of program completion.
        </p>
      ),
    },
    {
      id: "non-eligible-circumstances",
      title: "Circumstances Not Eligible for Refunds",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base">
          <p>
            The following situations do <strong className="text-red-600">not qualify</strong> for refunds:
          </p>
          <ul className="space-y-1">
            {[
              "Student absence from classes",
              "Student withdrawal (kit remains with student)",
              "Dissatisfaction with course content",
              "Family schedule changes",
              "Medical issues or emergencies",
              "Weather-related cancellations",
              "Technology equipment malfunctions",
              "Changes in student interest",
              "Loss or damage to robotics kit"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF7043] mt-1 flex-shrink-0"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "class-cancellations",
      title: "Class Cancellations by Bricks",
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base">
          <p>
            In the rare event that Bricks must cancel a course, we offer <strong className="text-green-600">alternatives instead of refunds</strong>:
          </p>
          <ul className="space-y-1">
            {[
              "Transfer Course: Move to another available course of equal value",
              "Future Credit: Credit toward future enrollment",
              "Reschedule: Move to a later session"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFAB91] mt-1 flex-shrink-0"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "makeup-classes",
      title: "Make-Up Classes",
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          If a student misses classes, we may offer make-up sessions at our discretion, subject to instructor availability, facility capacity, and advance notice from families.
        </p>
      ),
    },
    {
      id: "course-changes",
      title: "Course Changes",
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          Students may request to transfer to a different course before the start date, subject to availability and fee adjustments.
        </p>
      ),
    },
    {
      id: "understanding-policy",
      title: "Understanding Our Policy",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          By enrolling, families acknowledge they have read and understood this no-refund policy, that all sales are final, and no exceptions will be made.
        </p>
      ),
    },
    {
      id: "course-information",
      title: "Course Information and Expectations",
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          We encourage families to thoroughly review course descriptions, ask questions, visit our facility, and speak with instructors before enrollment.
        </p>
      ),
    },
    {
      id: "payment-disputes",
      title: "Payment Disputes",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          For payment disputes or billing errors, contact our office immediately. We will investigate and resolve legitimate billing errors.
        </p>
      ),
    },
    {
      id: "policy-modifications",
      title: "Policy Modifications",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          Bricks reserves the right to modify this refund policy at any time. Changes will be posted on our website and communicated to families.
        </p>
      ),
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1 border border-blue-200 text-xs sm:text-sm">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">Legal Document</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bricks Education</h1>
          <p className="text-sm sm:text-lg text-gray-600">Adhyayan and Aryan Jakhar</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Refund Policy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Clear, transparent terms for our robotics and programming education programs
          </p>
          <div className="text-xs sm:text-sm text-gray-500">Effective Date: July 2025</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 flex items-start gap-3">
          <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600 mt-1" />
          <div>
            <h3 className="text-sm sm:text-xl font-semibold text-red-900 mb-1 sm:mb-2">
              Important Notice: No Refund Policy
            </h3>
            <p className="text-xs sm:text-sm text-red-800">
              At Bricks, we maintain a strict no-refund policy due to the hands-on nature of our robotics programs and the resources allocated for each student.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3 sm:space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 sm:px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600">
                    {section.icon}
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                    {index + 1}. {section.title}
                  </h3>
                </div>
                {expandedSections[section.id] ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
              </button>

              {expandedSections[section.id] && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

    

        {/* Footer */}
        <div className="text-center py-6 sm:py-8">
          <div className="max-w-3xl mx-auto bg-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6 text-sm sm:text-base">
            <p>
              By enrolling in Bricks programs, you acknowledge that you have read, understood, and agree to abide by this{" "}
              <span className="text-red-600 font-semibold">No Refund Policy</span>.
            </p>
          </div>
        </div>

      </div>
    </div>
    <Footer/>

    </>
  );
};

export default RefundPolicy;
