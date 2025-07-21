import React, { useEffect } from "react";
import { FaHome, FaMoneyBillWave, FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { setLastScrollY, setShowNavbar } from "../features/scroll/scrollSlice";
import Sidebar from "../components/Sidebar";
// import SidebarAction from "../actionfunctions/SidebarAction";

const Home = () => {
  const dispatch = useDispatch();
  const { showNavbar, lastScrollY } = useSelector((store) => store.scroll);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) { // Keep navbar visible at the top
        dispatch(setShowNavbar(true));
      } else if (currentScrollY > lastScrollY) {
        dispatch(setShowNavbar(false));
      } else {
        dispatch(setShowNavbar(true));
      }
      dispatch(setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, lastScrollY]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Sidebar />

      <header
        className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Navbar />
      </header>

      <main>
        <section className="flex flex-col items-center justify-center text-center min-h-screen pt-28 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Find Your New Home?
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl">
            Use our smart chat assistant or browse listings directly to discover the perfect PG for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/chatbot"
              className="w-full sm:w-auto bg-blue-600/30 text-white p-4 px-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:bg-blue-500/50 ring-2 ring-blue-500 font-mono text-lg"
            >
              Chat with the PG Bot
            </Link>
            <Link
              to="/search"
              className="w-full sm:w-auto bg-white/10 text-white p-4 px-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:bg-white/20 ring-2 ring-slate-500 font-mono text-lg"
            >
              Search For PGs
            </Link>
          </div>
        </section>

        <section className="py-16 lg:py-24" id="about">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              Why Choose Our PG Finder?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center transition hover:shadow-blue-500/20 hover:-translate-y-2">
                <FaHome className="text-5xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Wide Range of Options</h3>
                <p className="text-gray-400">Browse through a diverse selection of PG accommodations to find your perfect match.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center transition hover:shadow-green-500/20 hover:-translate-y-2">
                <FaMoneyBillWave className="text-5xl text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Affordable Prices</h3>
                <p className="text-gray-400">Find accommodations that fit your budget without compromising on quality.</p>
              </div>
              {/* Card 3 */}
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center transition hover:shadow-purple-500/20 hover:-translate-y-2">
                <FaUserFriends className="text-5xl text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Verified Listings</h3>
                <p className="text-gray-400">All our listings are verified to ensure a safe and reliable experience for you.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default Home;