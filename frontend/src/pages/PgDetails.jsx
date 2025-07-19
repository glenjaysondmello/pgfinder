import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPg, addToCart } from "../features/pgslice/pgSlice";
import { payment, verify } from "../features/payment/paymentSlice";
import Loader from "../animations/Loader";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const PgDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.pg);
  const { selectedPg, status, error } = useSelector((store) => store.pg);

  useEffect(() => {
    if (id) {
      dispatch(getPg(id)).unwrap();
    }
  }, [dispatch, id]);

  const handleAddCart = (pgRoomId) => {
    try {
      const itemExists = cart?.items?.some(
        (item) => item.pgId._id === pgRoomId
      );

      if (itemExists) {
        toast.error("Item is already in the cart");
        return;
      }

      dispatch(addToCart({ pgRoomId, quantity: 1 }));
      toast.success("Added to Cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (status === "error") {
    return <p className="text-red-600 text-center mt-4">Error: {error}</p>;
  }

  const handlePayment = async (amt, pgId) => {
    try {
      const result = await dispatch(payment({amt, pgId})).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.amount * 100,
        currency: "INR",
        name: "MY PG",
        description: "Payment of PG",
        order_id: result.id,
        handler: async function (res) {
          await dispatch(
            verify({
              pgId,
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              amount: result.amount / 100,
            })
          ).unwrap();
          toast.success("Payment Successful");
        },
        theme: {
          color: "#38bdf8",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Initiation Failed", error);
      toast.error("Payment failed", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-2xl">
        {selectedPg ? (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {selectedPg.name}
            </h2>
            <p className="text-gray-600 text-lg">
              <span className="font-semibold">Location:</span>{" "}
              {selectedPg.location}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Contact Number:</span>{" "}
              {selectedPg.contactNumber}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {selectedPg.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Amenities:</span>{" "}
              {selectedPg.amenities}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Price:</span> ₹{selectedPg.price}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Availability:</span>{" "}
              <span
                className={
                  selectedPg.availability
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {selectedPg.availability ? "Available" : "Not Available"}
              </span>
            </p>
            <p className="text-gray-700 leading-relaxed">
              {selectedPg.description}
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Gallery</h3>
              {selectedPg.images?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedPg.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`PG ${selectedPg.name}`}
                      className="rounded-lg object-cover w-full h-60 shadow-md"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No Images Available</p>
              )}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleAddCart(selectedPg._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-4 rounded-lg"
              >
                Add To Cart
              </button>

              <button
                onClick={() => handlePayment(selectedPg.price, selectedPg._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-2 py-4 rounded-lg"
              >
                Pay {selectedPg.price}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No PG Found</p>
        )}
      </div>
    </div>
  );
};

export default PgDetails;
