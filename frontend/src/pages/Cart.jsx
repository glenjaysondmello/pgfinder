import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Slices & Actions
import { fetchCart, removeFromCart } from "../features/pgslice/pgSlice";

// Components & Icons
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../animations/Loader";
import { FaTrash, FaMapMarkerAlt, FaRupeeSign, FaEye, FaListAlt } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  // Assuming your slice also provides a status for loading states
  const { cart, status } = useSelector((store) => store.pg);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveCart = (pgRoomId) => {
    try {
      dispatch(removeFromCart(pgRoomId));
      toast.success("Removed from your list");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex justify-center items-center pt-20">
          <Loader />
        </div>
      );
    }

    if (!cart?.items || cart.items.length === 0) {
      // highlight-start
      // --- Engaging Empty State ---
      return (
        <div className="text-center py-20 flex flex-col items-center">
          <FaListAlt className="text-6xl text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your List is Empty</h2>
          <p className="text-gray-400 mb-6">You haven't added any PGs to your list yet.</p>
          <Link
            to="/search"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Find a PG
          </Link>
        </div>
      );
      // highlight-end
    }

    return (
      <div className="space-y-6">
        {cart.items.map((item) => {
          if (!item.pgId) {
            return (
              <div key={item._id} className="bg-gray-800 p-4 rounded-xl text-red-400">
                An item in your list could not be loaded. It may have been removed.
              </div>
            );
          }

          // highlight-start
          // --- Modern Cart Item Card ---
          return (
            <div
              key={item.pgId._id}
              className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <div className="w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                <img
                  src={item.pgId.images?.[0] || 'https://via.placeholder.com/400x300.png?text=No+Image'}
                  alt={`PG ${item.pgId.name}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {/* Details */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.pgId.name}</h3>
                  <p className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <FaMapMarkerAlt /> {item.pgId.location}
                  </p>
                  <p className="flex items-center gap-2 text-green-400 font-semibold mt-2">
                    <FaRupeeSign /> {item.pgId.price} / month
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Link
                    to={`/search/pg/${item.pgId._id}`}
                    className="flex-1 text-center bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaEye /> View Details
                  </Link>
                  <button
                    className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => handleRemoveCart(item.pgId._id)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
          // highlight-end
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Sidebar />
      <header className="fixed top-0 left-0 w-full z-40">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 pt-28 sm:pt-32 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Shortlisted PGs</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Cart;