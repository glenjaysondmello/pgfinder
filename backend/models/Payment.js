const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  pgId: {type: mongoose.Schema.Types.ObjectId, required: true},
  pgName: {type: String, required: true},
  pgLocation: {type: String, required: true},
  email: {type: String, required: true},
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
