import React from "react";
import { Link } from "react-router";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGooglePlay,
  FaApple,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/images/logo.png" className="w-6 sm:w-9" alt="" />
                <span className="text-white text-2xl sm:text-5xl font-bold">BechaKena</span>
              </Link>
            </div>
            <p className="text-sm text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              Experience our new platform & Enjoy exiting deals and offers on
              your day to day
            </p>
            <div className="space-y-2 sm:space-y-3 text-sm">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm">
                  House #64, Road 13, ASA Center, Uttara, Dhaka-1402
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm">01729-1497201</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm">BechaKena@gmail.com</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4 sm:mb-6 text-gray-400 uppercase tracking-wide text-xs sm:text-sm">
              ABOUT
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="hover:text-white transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="hover:text-white transition-colors"
                >
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4 sm:mb-6 text-gray-400 uppercase tracking-wide text-xs sm:text-sm">
              HELP
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
              <li>
                <Link
                  to="/payments"
                  className="hover:text-white transition-colors"
                >
                  Payments
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="hover:text-white transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-use"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="hover:text-white transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Need Support & Download App */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-gray-400 text-xs sm:text-sm">
              Need Support?
            </h3>
            <div className="border border-teal-500 rounded-lg p-2 sm:p-3 mb-6 sm:mb-8 bg-slate-800">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span className="text-white font-medium text-sm sm:text-base">10724-7814XX</span>
              </div>
            </div>

            <h3 className="font-semibold mb-3 sm:mb-4 text-gray-400 uppercase tracking-wide text-xs sm:text-sm">
              DOWNLOAD APP
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="bg-black border border-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-800 transition-colors">
                <FaGooglePlay className="w-4 h-4 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-300">GET IT ON</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    Google Play
                  </div>
                </div>
              </div>
              <div className="bg-black border border-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-800 transition-colors">
                <FaApple className="w-4 h-4 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-300">Download on the</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    App Store
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 gap-4">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <span className="text-xs sm:text-sm text-gray-400">Follow us on</span>
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="#"
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <FaFacebookF className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors"
                >
                  <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                >
                  <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">PAYMENTS ACCEPTED</span>
              <div className="flex gap-1 sm:gap-2 items-center">
                <img 
                  src="/images/visa.png" 
                  alt="Visa" 
                  className="h-6 sm:h-8 w-auto object-contain"
                />
                <img 
                  src="/images/master.png" 
                  alt="Mastercard" 
                  className="h-6 sm:h-8 w-auto object-contain"
                />
                <img 
                  src="/images/amex.png" 
                  alt="American Express" 
                  className="h-6 sm:h-8 w-auto object-contain"
                />
                <img 
                  src="/images/bkash.png" 
                  alt="bKash" 
                  className="h-6 sm:h-8 w-auto object-contain"
                />
                <img 
                  src="/images/nogod.png" 
                  alt="Nagad" 
                  className="h-6 sm:h-8 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
            BechaKena ©2025. Design by Fakhrul
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
