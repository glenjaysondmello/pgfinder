import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { clearAuthUser } from "../features/auth/authSlice";
import { setCloseBar } from "../features/sidebar/sidebarSlice";
import toast from "react-hot-toast";
import Avatar from "react-avatar";
import { FaHome, FaTimes } from "react-icons/fa";
import { SiChatbot } from "react-icons/si";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { IoSettingsSharp, IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open } = useSelector((store) => store.sidebar);
  const { user, role } = useSelector((store) => store.auth);
  const token = localStorage.getItem("token");

  const allItems = [
    { icon: <FaHome size="20px" />, text: "Home", browse: () => navigate("/") },
    { icon: <SiChatbot size="20px" />, text: "Chat", browse: () => navigate("/chatbot") },
    { icon: <PiShoppingCartSimpleFill size="20px" />, text: "Your List", browse: () => navigate("/cart") },
    { icon: <IoSettingsSharp size="20px" />, text: "Settings", browse: () => navigate("/settings") },
    { icon: <CgProfile size="20px" />, text: "Admin", browse: () => navigate("/admin"), adminOnly: true },
  ];

  const visibleItems = useMemo(() => {
    return role === "admin" ? allItems : allItems.filter(item => !item.adminOnly);
  }, [role]);

  const handleNavigate = (browseFunc) => {
    browseFunc();
    dispatch(setCloseBar());
  };
  
  const logOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearAuthUser());
        toast.success("Logged Out Successfully");
        dispatch(setCloseBar());
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-black/60" onClick={() => dispatch(setCloseBar())}></div>

      <div
        className={`relative flex flex-col h-full w-64 sm:w-72 bg-black/50 backdrop-blur-xl shadow-2xl text-white transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => dispatch(setCloseBar())} className="p-2 rounded-full hover:bg-gray-700/60">
            <FaTimes size={20} />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {visibleItems.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-blue-500/30 transition-colors duration-200"
              onClick={() => handleNavigate(item.browse)}
            >
              {item.icon}
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          {user && token ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.photoURL || "https://tse3.mm.bing.net/th?id=OIP.btgP01toqugcXjPwAF-k2AHaHa&pid=Api&P=0&h=180"}
                  name={user.displayName}
                  size="40"
                  round={true}
                />
                <h3 className="font-semibold truncate">{user.displayName || "User"}</h3>
              </div>
              <button
                onClick={logOut}
                className="w-full flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200"
              >
                <IoLogOutOutline size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handleNavigate(() => navigate("/login"))}
                className="w-full bg-blue-600/80 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate(() => navigate("/signup"))}
                className="w-full bg-gray-600/80 hover:bg-gray-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200"
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;