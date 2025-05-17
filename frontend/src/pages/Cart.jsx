import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../features/pgslice/pgSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.pg);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveCart = (pgRoomId) => {
    try {
      dispatch(removeFromCart(pgRoomId));
      toast.success("Removed Item from Cart");
      fetchCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove from the cart");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart?.items?.length > 0 ? (
        <div className="space-y-4">
          {cart.items.map((item) => {
            if (!item.pgId) {
              return (
                <div key={item._id} className="border-b pb-4">
                  <p className="text-red-500">Item not found.</p>
                </div>
              );
            }

            return (
              <div key={item.pgId._id} className="border-b pb-4">
                <h3 className="text-lg font-semibold">{item.pgId.name}</h3>
                <p>Price: ₹{item.pgId.price}</p>
                <p>Location: {item.pgId.location}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                  onClick={() => handleRemoveCart(item.pgId._id)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
