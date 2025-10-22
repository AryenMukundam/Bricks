import React, { useState } from "react";
import {
  Shield,
  ChevronDown,
  ChevronUp,
  Phone,
  FileText,
  Users,
  CreditCard,
  AlertTriangle,
  Book,
  Scale,
} from "lucide-react";
import Footer from "../components/BeforeLogin/Footer";

const TermsAndConditions = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections = [
    {
      id: "services",
      title: "About Our Services",
      icon: <Book className="w-5 h-5" />,
      content: (
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Robotics workshops with kits
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Programming and coding instruction
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Tech problem-solving projects
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Creative & technical skill development
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Robotics kit included with bootcamp
          </li>
        </ul>
      ),
    },
    {
      id: "enrollment",
      title: "Enrollment and Registration",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            Parents/guardians must enroll minors. Accurate details and fee
            payment are required.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="w-2 h-2 mt-2 rounded-full bg-[#FF7043]"></span>
              Complete and accurate registration info
            </li>
            <li className="flex gap-2">
              <span className="w-2 h-2 mt-2 rounded-full bg-[#FF7043]"></span>
              Fee payment secures enrollment
            </li>
            <li className="flex gap-2">
              <span className="w-2 h-2 mt-2 rounded-full bg-[#FF7043]"></span>
              Medical/special needs disclosure required
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "payment",
      title: "Payment Terms",
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FFAB91]"></span>
            Fees due before classes begin
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FFAB91]"></span>
            Bootcamp fee includes robotics kit
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FFAB91]"></span>
            Kits owned by students after full payment
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FFAB91]"></span>
            Lost/damaged kits may require replacement fee
          </li>
        </ul>
      ),
    },
    {
      id: "conduct",
      title: "Student Conduct and Safety",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Follow instructor guidance & safety
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Respect peers, instructors & equipment
          </li>
          <li className="flex gap-2">
            <span className="w-2 h-2 mt-2 rounded-full bg-[#FF5722]"></span>
            Bring assigned kit each session
          </li>
        </ul>
      ),
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <p className="text-gray-700">
          All materials belong to Bricks. Student projects remain theirs, but
          may be used for promotional purposes with consent.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <p className="text-gray-700">
          Liability is limited to fees paid. Robotics activities involve
          inherent risks acknowledged by parents.
        </p>
      ),
    },
    {
      id: "privacy",
      title: "Privacy and Data Protection",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <p className="text-gray-700">
          Data is collected and used per our Privacy Policy, only for
          educational/admin purposes.
        </p>
      ),
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <p className="text-gray-700">
          Terms may change anytime with notice to families and updates on our
          website.
        </p>
      ),
    },
    {
      id: "governing",
      title: "Governing Law",
      icon: <Scale className="w-5 h-5" />,
      content: (
        <p className="text-gray-700">
          These Terms are governed by Indian law. Disputes will be resolved
          under Bengaluru jurisdiction.
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
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">
                Legal Document
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Bricks Education
            </h1>
            <p className="text-lg text-gray-600">Adhyayan and Aryan Jakhar</p>

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">
              Terms and Conditions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our robotics
              education services.
            </p>
            <div className="text-sm text-gray-500">Last updated: July 2025</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        {/* Intro */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <p className="text-gray-700">
            Welcome to{" "}
            <span className="font-semibold text-[#FF5722]">Bricks</span>! By
            enrolling in our courses, you agree to the following terms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3 sm:space-y-4">
          {sections.map((section, i) => (
            <div
              key={section.id}
              className="bg-white border border-gray-200 rounded-lg"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {section.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {i + 1}. {section.title}
                  </h3>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </button>
              {expandedSections[section.id] && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200">
                  <div className="pt-3">{section.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center py-8">
          <div className="max-w-3xl mx-auto bg-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-gray-800 text-base sm:text-lg">
              By enrolling in Bricks programs, you acknowledge and accept these{" "}
              <span className="text-blue-600 font-semibold">
                Terms and Conditions
              </span>
              .
            </p>
            <div className="text-sm text-gray-500 mt-2">
              These terms are subject to change with notice.
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer/>
    </>
  );
};

export default TermsAndConditions;
