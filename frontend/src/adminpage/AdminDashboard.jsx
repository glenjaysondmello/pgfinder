import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaPlusCircle, FaListAlt, FaFileInvoiceDollar } from "react-icons/fa";

export const AdminLayout = ({ children }) => {
  return (
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
};

const AdminDashboard = () => {
  const adminLinks = [
    {
      to: "/admin/addpg",
      label: "Add New PG",
      icon: <FaPlusCircle className="text-4xl text-green-400" />,
      color: "hover:ring-green-500",
    },
    {
      to: "/admin/getpg",
      label: "Manage All PGs",
      icon: <FaListAlt className="text-4xl text-blue-400" />,
      color: "hover:ring-blue-500",
    },
    {
      to: "/admin/payment_logs",
      label: "View Payment Logs",
      icon: <FaFileInvoiceDollar className="text-4xl text-purple-400" />,
      color: "hover:ring-purple-500",
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mb-8">
          Welcome! Select an action below or use the sidebar to navigate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminLinks.map((link) => (
            <Link to={link.to} key={link.label}>
              <div
                className={`bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 ring-2 ring-gray-700 ${link.color} flex flex-col items-center justify-center h-48`}
              >
                <div className="mb-4">{link.icon}</div>
                <p className="font-mono text-xl font-semibold text-white text-center">
                  {link.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
