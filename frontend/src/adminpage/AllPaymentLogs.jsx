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
    <div className="p-4">
      <h2 className="text-2xl mb-4">Admin Payment Logs</h2>
      {history?.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th>Email</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((payment) => (
              <tr key={payment._id}>
                <td>{payment?.email || "N/A"}</td>
                <td>₹{payment?.amount ? payment.amount / 100 : "N/A"}</td>
                <td>{new Date(payment?.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllPaymentLogs;
