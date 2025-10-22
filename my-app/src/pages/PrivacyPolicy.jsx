import React, { useState } from "react";
import {
  Shield,
  Book,
  Users,
  Lock,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "../components/BeforeLogin/Navbar";
import Footer from "../components/BeforeLogin/Footer";

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base">
          <p>
            Bricks Education collects various types of information to provide
            and improve our robotics and programming education services. This
            includes:
          </p>
          <ul className="space-y-1">
            {[
              {
                label: "Personal Identification Information",
                text: "Name, email address, phone number, physical address, date of birth (for age-appropriate program placement), and parent/guardian contact details.",
              },
              {
                label: "Technical Data",
                text: "IP address, browser type, operating system, and usage patterns when you interact with our website.",
              },
              {
                label: "Educational Progress Data",
                text: "Information related to student performance, project completion, and participation within our courses.",
              },
              {
                label: "Communication Data",
                text: "Records of correspondence, including emails and messages sent through our contact forms.",
              },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF5722] mt-1 flex-shrink-0"></div>
                <span>
                  <strong>{item.label}:</strong> {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base">
          <p>
            The information collected by Bricks Education is used for the
            following purposes:
          </p>
          <ul className="space-y-1">
            {[
              {
                label: "To Provide Services",
                text: "To process registrations, enroll students in courses, deliver educational content, and manage program logistics.",
              },
              {
                label: "Communication",
                text: "To respond to inquiries, send important updates about courses, events, and policy changes, and provide customer support.",
              },
              {
                label: "Improvement of Services",
                text: "To analyze usage patterns, gather feedback, and enhance our curriculum, teaching methods, and website functionality.",
              },
              {
                label: "Marketing and Promotions",
                text: "With explicit consent, to inform you about new courses, special offers, or relevant educational content.",
              },
              {
                label: "Legal Compliance",
                text: "To comply with legal obligations, resolve disputes, and enforce our agreements.",
              },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF7043] mt-1 flex-shrink-0"></div>
                <span>
                  <strong>{item.label}:</strong> {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "data-protection",
      title: "How We Protect Your Information",
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base">
          <p>
            Bricks Education is committed to protecting your personal
            information. We implement a variety of security measures to maintain
            the safety of your data:
          </p>
          <ul className="space-y-1">
            {[
              "Secure Data Storage: We store personal data on secure servers with restricted access.",
              "Encryption: Data transmitted to and from our website is protected using SSL/TLS encryption.",
              "Access Control: Access to personal data is limited to authorized personnel.",
              "Regular Security Audits: We regularly review our security practices to prevent unauthorized access.",
              "Third-Party Processors: We ensure service providers adhere to strict data protection standards.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFAB91] mt-1 flex-shrink-0"></div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "your-rights",
      title: "Your Data Protection Rights",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base">
          <p>You have certain rights regarding your personal data:</p>
          <ul className="space-y-1">
            {[
              "Right to Access: Request a copy of the personal data we hold.",
              "Right to Rectification: Request correction of inaccurate or incomplete data.",
              "Right to Erasure: Request deletion of your personal data, subject to legal obligations.",
              "Right to Object: Object to the processing of your data for certain purposes.",
              "To exercise these rights, please contact us.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF5722] mt-1 flex-shrink-0"></div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "policy-changes",
      title: "Changes to This Privacy Policy",
      icon: <Mail className="w-5 h-5" />,
      content: (
        <p className="text-sm sm:text-base">
          Bricks Education reserves the right to update this Privacy Policy at
          any time. Changes will be posted on this page with an updated
          "Effective Date."
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bricks Education
          </h1>
          <p className="text-sm sm:text-lg text-gray-600">
            Adhyayan and Aryan Jakhar
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Privacy Policy
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Your privacy is important to us. Learn how we collect, use, and
            protect your information.
          </p>
          <div className="text-xs sm:text-sm text-gray-500">
            Effective Date: July 2025
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">
        {/* Intro Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-sm sm:text-base">
          <p>
            This Privacy Policy describes how{" "}
            <strong>Bricks Education</strong> collects, uses, and protects the
            personal information you provide when using our website and
            services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3 sm:space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
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
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                )}
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
              By using Bricks services, you acknowledge that you have read,
              understood, and agree to abide by this{" "}
              <span className="text-blue-600 font-semibold">Privacy Policy</span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PrivacyPolicy;
