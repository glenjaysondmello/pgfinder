import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";

const SidebarAction = () => {
  const { open } = useSelector((store) => store.sidebar);
  return (
    <div className="fixed top-0 left-0 w-full z-50 transition-transform duration-300">
      {open && <Sidebar />}
    </div>
  );
};

export default SidebarAction;
