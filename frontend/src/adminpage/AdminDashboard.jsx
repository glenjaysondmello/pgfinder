import React from "react";
import { Link, Outlet } from "react-router-dom";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import SidebarAction from "../actionfunctions/SidebarAction";

const AdminDashboard = () => {
  return (
    <div>
      {/* <Banner /> */}
      <Navbar/>
      <SidebarAction />
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-10 mb-60">
            <Link to="/admin/addpg" className="flex">
              <div className="bg-white/10 text-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none font-mono ring-2 ring-slate-500 hover:ring-blue-500">
                ADD PG
              </div>
            </Link>
            <Link to="/admin/getpg" className="flex">
              <div className="bg-white/10 text-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none font-mono ring-2 ring-slate-500 hover:ring-blue-500">
                ALL PG's
              </div>
            </Link>
            <Link to="/admin/payment_logs" className="flex">
              <div className="bg-white/10 text-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none font-mono ring-2 ring-slate-500 hover:ring-blue-500">
                Payment Logs
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
