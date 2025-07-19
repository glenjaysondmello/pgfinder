import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-lg text-gray-700 mb-6">Thank you for your payment!</p>
      <br />
      <p className="text-lg text-gray-700 mb-6">
        The Mail has neen sent to you, Download your Payment Invoice there.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
