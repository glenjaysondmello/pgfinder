import React, { useEffect, useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { SiChatbot } from "react-icons/si";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();
  const { role } = useSelector((store) => store.auth);
  const [visibleItems, setVisibleItems] = useState([]);

  const items = [
    {
      icon: <FaHome size="24px" color="white" />,
      text: "Home",
      browse: () => navigate("/"),
    },
    {
      icon: <SiChatbot size="24px" color="white" />,
      text: "Chat",
      browse: () => navigate("/chatbot"),
    },
    {
      icon: <PiShoppingCartSimpleFill size="24px" color="white" />,
      text: "Your List",
      browse: () => navigate("/cart"),
    },
    {
      icon: <IoSettingsSharp size="24px" color="white" />,
      text: "Settings",
      browse: () => navigate("/settings"),
    },
    {
      icon: <CgProfile size="24px" color="white" />,
      text: "Admin",
      browse: () => navigate("/admin"),
    },
  ];

  useEffect(() => {
    if (role != "admin") {
      setVisibleItems(filterOutAdmin());
    } else {
      setVisibleItems(items);
    }
  }, [role]);

  const filterOutAdmin = () => {
    return items.filter((item) => item.text != "Admin");
  };

  return (
    <div className="fixed top-0 left-0 w-20 bg-black/30 backdrop-blur-lg flex flex-col items-center px-14 py-6 space-y-6 shadow-[0_8px_32px_rgb(0_0_0/0.5)] z-40 animate-fadeIn mt-32 rounded-2xl ml-5">
      {visibleItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-row items-center text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer animate-slideFromLeft p-5 space-x-4 space-y-2 mr-4 ml-4"
          onClick={item.browse}
        >
          <span>{item.icon}</span>
          <p className="text-[15px] mt-2 font-medium">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
