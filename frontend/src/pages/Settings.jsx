import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaChevronRight } from "react-icons/fa";

const PageLayout = ({ children }) => (
  <div className="bg-gray-900 min-h-screen">
    <Sidebar />
    <header className="fixed top-0 left-0 w-full z-40">
      <Navbar />
    </header>
    <main className="container mx-auto px-4 pt-28 sm:pt-32 pb-16">
      {children}
    </main>
  </div>
);


const Settings = () => {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Settings
        </h1>

        <div className="space-y-4">

          <Link
            to="payments"
            className="flex items-center justify-between bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-700/50 hover:ring-2 hover:ring-blue-500 transition-all duration-200"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Payments History
              </h2>
              <p className="text-gray-400">
                View all your past transactions securely in one place.
              </p>
            </div>
            <FaChevronRight className="text-gray-500" />
          </Link>
          
          {/* <Link
            to="profile"
            className="flex items-center justify-between bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-700/50 hover:ring-2 hover:ring-blue-500 transition-all duration-200"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Profile
              </h2>
              <p className="text-gray-400">
                Update your personal information and password.
              </p>
            </div>
            <FaChevronRight className="text-gray-500" />
          </Link> 
          */}

        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;