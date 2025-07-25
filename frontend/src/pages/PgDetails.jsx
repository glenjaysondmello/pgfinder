import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getPg, addToCart } from "../features/pgslice/pgSlice";
import { payment, verify } from "../features/payment/paymentSlice";
import Loader from "../animations/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CommentSection from "../components/CommentSection";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaThList,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaShoppingCart,
  FaCreditCard,
} from "react-icons/fa";

const PgDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, selectedPg, status, error } = useSelector((store) => store.pg);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getPg(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedPg?.images?.length > 0) {
      setMainImage(selectedPg.images[0]);
    }
  }, [selectedPg]);

  const handleAddCart = (pgRoomId) => {
    const itemExists = cart?.items?.some((item) => item.pgId._id === pgRoomId);
    if (itemExists) {
      toast.error("This PG is already in your list!");
      return;
    }
    dispatch(addToCart({ pgRoomId, quantity: 1 }));
    toast.success("Added to your list!");
  };

  const handlePayment = async (amt, pgId) => {
    try {
      const result = await dispatch(payment({ amt, pgId })).unwrap();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.amount * 100,
        currency: "INR",
        name: "PG Finder Booking",
        description: `Booking for ${selectedPg.name}`,
        order_id: result.id,
        handler: async function (res) {
          try {
            await dispatch(
              verify({
                pgId,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                amount: result.amount / 100,
              })
            ).unwrap();
            toast.success("Payment Successful!");
            navigate("/payment-success", { replace: true });
          } catch (verificationError) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3b82f6" },
        redirect: true,
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (paymentError) {
      toast.error("Payment initiation failed. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="bg-gray-900 flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (status === "failed" || !selectedPg) {
    return (
      <div className="bg-gray-900 text-white flex justify-center items-center h-screen">
        <p className="text-red-500 text-center mt-4 text-lg">
          Error: Could not load PG details. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Sidebar />
      <header className="fixed top-0 left-0 w-full z-40">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 pt-28 sm:pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl shadow-lg p-2 sticky top-28">
              <img
                src={
                  mainImage ||
                  "https://via.placeholder.com/800x600.png?text=No+Image"
                }
                alt="Main view"
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
              {selectedPg.images && selectedPg.images.length > 1 && (
                <div className="flex space-x-2 mt-2 overflow-x-auto p-1">
                  {selectedPg.images.map((image, index) => (
                    <button key={index} onClick={() => setMainImage(image)}>
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded-md transition-all duration-200 ${
                          mainImage === image
                            ? "ring-2 ring-blue-500 scale-105"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {selectedPg.name}
                </h1>
                <p className="flex items-center gap-2 text-gray-400 mt-2 text-lg">
                  <FaMapMarkerAlt /> {selectedPg.location}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaRupeeSign className="text-green-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="font-semibold">₹{selectedPg.price}/month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedPg.availability ? (
                    <FaCheckCircle className="text-green-400 text-xl" />
                  ) : (
                    <FaTimesCircle className="text-red-400 text-xl" />
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Availability</p>
                    <p
                      className={`font-semibold ${
                        selectedPg.availability
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedPg.availability ? "Available" : "Booked"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="text-blue-400 text-lg flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Contact</p>
                    <p className="font-semibold break-all">
                      {selectedPg.contactNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-blue-400 text-lg flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold break-all">
                      {selectedPg.email}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">About this PG</h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedPg.description}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPg.amenities?.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-blue-900/50 text-blue-300 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleAddCart(selectedPg._id)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <FaShoppingCart /> Add to List
                </button>
                <button
                  onClick={() =>
                    handlePayment(selectedPg.price, selectedPg._id)
                  }
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <FaCreditCard /> Book Now (₹{selectedPg.price})
                </button>
              </div>
            </div>
          </div>
        </div>
        <section className="max-w-4xl mx-auto mt-10">
          <CommentSection pgId={selectedPg._id} />
        </section>
      </main>
    </div>
  );
};

export default PgDetails;
