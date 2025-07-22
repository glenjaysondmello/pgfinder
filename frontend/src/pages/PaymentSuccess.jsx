import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaCheckCircle } from "react-icons/fa";

const PageLayout = ({ children }) => (
  <div className="bg-gray-900 min-h-screen flex flex-col">
    <Sidebar />
    <header className="fixed top-0 left-0 w-full z-40">
      <Navbar />
    </header>
    <main className="flex-1 flex items-center justify-center pt-24 sm:pt-28 pb-4 px-4">
      {children}
    </main>
  </div>
);

const PaymentSuccess = () => {
  return (
    <PageLayout>
      <div className="bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-700 text-center w-full max-w-lg animate-fade-in">
        
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/10 p-4 rounded-full animate-pulse">
            <FaCheckCircle className="text-6xl text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Payment Successful!
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Thank you for your booking. Your PG is confirmed.
        </p>

        <p className="text-gray-400 mb-8">
          A confirmation email with your payment invoice has been sent to you.
        </p>
        
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          Go to Home
        </Link>
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;