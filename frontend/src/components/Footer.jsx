import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-lg text-white rounded-xl p-6 sm:p-8 mx-2 sm:mx-4 my-6 shadow-2xl border border-gray-700/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="mb-4 lg:mb-0">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="https://tse3.mm.bing.net/th?id=OIP.VB187cXwkH66uPWT3X34JQHaHa&pid=Api&P=0&h=180"
                alt="logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1 className="text-xl text-white font-bold">PG-Finder</h1>
            </Link>
            <p className="text-gray-400">
              Your one-stop solution for finding the perfect PG accommodation.
            </p>
          </div>

          <div className="mb-4 lg:mb-0">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#about"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Search PGs
                </Link>
              </li>
              <li>
                <Link
                  to="/chatbot"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Chat with Bot
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-4 lg:mb-0">
            <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
            <p className="text-gray-400">
              <a
                href="mailto:support@pgfinder.com"
                className="hover:text-blue-400 transition-colors"
              >
                support@pgfinder.com
              </a>
            </p>
            <p className="text-gray-400 mt-2">
              <a
                href="tel:+919972487827"
                className="hover:text-blue-400 transition-colors"
              >
                +91 99724 87827
              </a>
            </p>
            <p className="text-gray-400 mt-2">
              Dakshina Kannada, Karnataka, India
            </p>
          </div>

          <div className="mb-4 lg:mb-0">
            <h3 className="text-xl font-bold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebookF size={22} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 transition-colors"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaLinkedinIn size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PG Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
