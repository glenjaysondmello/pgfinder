import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Settings = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="payments"
            className="block bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Payments History
            </h2>
            <p className="text-gray-600">
              View all your past transactions securely in one place.
            </p>
            <div className="mt-4">
              <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                View
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
