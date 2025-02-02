import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-lg rounded-xl p-4 mx-4 my-6 shadow-[0_8px_32px_rgb(0_0_0/0.5)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 text-gray-300">Contact Us</h3>
            <p className="text-gray-300 ">
              Email :{" "}
              <a
                href="mailto:support@pgfinder.com"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                support@pgfinder.com
              </a>
            </p>
            <p className="text-gray-300 mt-2">
              Phone :{" "}
              <a
                href="tel:+919972487827"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                +91 99724 87827
              </a>
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 text-gray-300">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <FaFacebook size={24} className="text-gray-300" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <FaTwitter size={24} className="text-gray-300" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <FaInstagram size={24} className="text-gray-300" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <FaLinkedin size={24} className="text-gray-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} PG Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
