import React from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const { cart } = useSelector((store) => store.pg);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.length > 0 ? (
        <div className="space-y-4">
          {cart.map((pg) => (
            <div key={pg._id} className="border-b pb-4">
              <h3 className="text-lg font-semibold">{pg.name}</h3>
              <p>Price: ₹{pg.price}</p>
              <p>Location: {pg.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
