import React from "react";
import { Phone, Mail, MapPin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#fff8f2] border-t">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-orange-600 mb-1 sm:mb-2">
              BRICKS EDUCATION
            </h2>
            <p className="text-orange-700 font-medium mb-1 sm:mb-3 text-[11px] sm:text-sm">
              Learning by Doing, Leading by Thinking!
            </p>
            <p className="text-gray-600 text-[11px] sm:text-sm leading-relaxed">
              Empowering students through innovative robotics education and hands-on learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-4 text-gray-800 text-xs sm:text-base">
              Quick Links
            </h3>
            <div className="space-y-1 sm:space-y-2">
              {[
                ["Home", "/"],
                ["Bootcamp", "/bootcamp"],
                ["Contact", "/contact"],
                ["Refund Policy", "/refund-policy"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms-and-conditions"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="block text-gray-700 hover:text-orange-600 text-[11px] sm:text-sm"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-4 text-gray-800 text-xs sm:text-base">
              Contact
            </h3>
            <div className="space-y-1 sm:space-y-2 text-[11px] sm:text-sm">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-orange-600" />
                <a
                  href="tel:+919462311937"
                  className="text-gray-700 hover:text-orange-600"
                >
                  +91 94623 11937
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-orange-600" />
                <a
                  href="mailto:schoolsupport@bricks.org.in"
                  className="text-gray-700 hover:text-orange-600"
                >
                  schoolsupport@bricks.org.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={13} className="text-orange-600" />
                <a
                  href="https://www.bricks.org.in"
                  className="text-gray-700 hover:text-orange-600"
                >
                  www.bricks.org.in
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-4 text-gray-800 text-xs sm:text-base">
              Location
            </h3>
            <div className="flex items-start gap-2 text-[11px] sm:text-sm">
              <MapPin size={13} className="text-orange-600 mt-0.5" />
              <p className="text-gray-700 leading-snug">
                BRICKS EDUCATION <br />
                Electronic City, Bangalore, INDIA
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-10 border-t pt-3 sm:pt-6 text-center text-gray-500 text-[10px] sm:text-xs">
          © {new Date().getFullYear()} BRICKS Education. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
