import React, { useEffect } from "react";
import { FaHome, FaMoneyBillWave, FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { setLastScrollY, setShowNavbar } from "../features/scroll/scrollSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { showNavbar } = useSelector((store) => store.scroll);
  const { lastScrollY } = useSelector((store) => store.scroll);
  const { open } = useSelector((store) => store.sidebar);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        dispatch(setShowNavbar(false));
      } else {
        dispatch(setShowNavbar(true));
      }

      dispatch(setLastScrollY(currentScrollY));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch, lastScrollY]);
  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Navbar />
      </div>

      <div className="fixed top-0 left-0 w-full z-50 transition-transform duration-300">
        {open && <Sidebar />}
      </div>
      <section className="mt-72">
        <h1 className="text-3xl font-bold mb-8 text-white flex items-center justify-center">
          Ready to Find Your New Home?
        </h1>
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-4">
            <Link to="/chatbot">
              <div className="bg-white/10 text-white p-4 rounded-lg shadow-lg transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none font-mono ring-2 ring-slate-500 hover:ring-blue-500">
                Chat with the PG Bot
              </div>
            </Link>
            <Link to="/search">
              <div className="bg-white/10 text-white p-4 rounded-lg shadow-lg transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none font-mono ring-2 ring-slate-500 hover:ring-blue-500">
                Search For PG's
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 mt-60 mb-64" id="about">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose Our PG Finder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaHome className="text-5xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Wide Range of Options
              </h3>
              <p>
                Browse through a diverse selection of PG accommodations to find
                your perfect match.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaMoneyBillWave className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Affordable Prices</h3>
              <p>
                Find accommodations that fit your budget without compromising on
                quality.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaUserFriends className="text-5xl text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p>
                All our listings are verified to ensure a safe and reliable
                experience for you.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
