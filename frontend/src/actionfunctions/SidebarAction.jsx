import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { setCloseBar } from "../features/sidebar/sidebarSlice";

const SidebarAction = () => {
  const dispatch = useDispatch();
  const { open } = useSelector((store) => store.sidebar);

  useEffect(() => {
    dispatch(setCloseBar());
  }, [dispatch]);
  return (
    <div className="fixed top-0 left-0 w-full z-50 transition-transform duration-300">
      {open && <Sidebar />}
    </div>
  );
};

export default SidebarAction;
