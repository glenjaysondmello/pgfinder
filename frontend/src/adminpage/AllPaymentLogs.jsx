import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogs } from "../features/payment/paymentSlice";

const AllPaymentLogs = () => {
  const dispatch = useDispatch();
  const { history, fetchPaymentsStatus, error } = useSelector(
    (state) => state.pay
  );

  useEffect(() => {
    dispatch(adminLogs());
  }, [dispatch]);

  if (fetchPaymentsStatus === "loading") {
    return <p>Loading payment logs...</p>;
  }

  if (fetchPaymentsStatus === "failed") {
    return <p className="text-red-600">Error: {error?.error || error || "Failed to fetch"}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Payment History
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Payment ID
                </th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                   <td className="py-3 px-4 truncate max-w-xs">
                    {payment.email}
                  </td>
                  <td className="py-3 px-4 truncate max-w-xs">
                    {payment.razorpay_payment_id}
                  </td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    ₹{payment.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllPaymentLogs;

