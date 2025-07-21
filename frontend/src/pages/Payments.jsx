import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogs } from "../features/payment/paymentSlice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../animations/Loader";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Payments = () => {
  const dispatch = useDispatch();
  const { history, fetchPaymentsStatus, error } = useSelector(
    (store) => store.pay
  );

  useEffect(() => {
    dispatch(userLogs());
  }, [dispatch]);

  const renderContent = () => {
    if (fetchPaymentsStatus === "loading") {
      return (
        <div className="flex justify-center items-center pt-20">
          <Loader />
        </div>
      );
    }

    if (fetchPaymentsStatus === "failed") {
      return (
        <div className="text-center pt-20">
          <p className="text-red-500 text-lg">
            Error: {error?.error || error || "Failed to fetch payment history."}
          </p>
        </div>
      );
    }

    if (!history || history.length === 0) {
      return (
        <div className="text-center py-20 flex flex-col items-center">
          <FaFileInvoiceDollar className="text-6xl text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Payment History</h2>
          <p className="text-gray-400 mb-6">Your payment records will appear here after a successful booking.</p>
          <Link
            to="/search"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Find a PG to Book
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div className="hidden md:block overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">Payment ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">PG ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              {history.map((payment) => (
                <tr key={payment._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 px-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 font-mono truncate max-w-xs">{payment.razorpay_payment_id}</td>
                  <td className="py-4 px-4 font-mono truncate max-w-xs">{payment.pgId}</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">₹{payment.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="block md:hidden space-y-4">
          {history.map((payment) => (
            <div key={payment._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Payment ID</p>
                  <p className="font-mono text-sm text-gray-200 truncate">{payment.razorpay_payment_id}</p>
                </div>
                <p className="text-lg font-bold text-green-400">₹{payment.amount}</p>
              </div>
              <div className="mt-4 border-t border-gray-700 pt-3">
                 <p className="text-sm text-gray-400">PG ID</p>
                 <p className="font-mono text-sm text-gray-200 truncate">{payment.pgId}</p>
                 <p className="text-sm text-gray-400 mt-2">Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="bg-gray-900 min-h-screen">
      <Sidebar />
      <header className="fixed top-0 left-0 w-full z-40">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 pt-28 sm:pt-32 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
          Payment History
        </h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Payments;