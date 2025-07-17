const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Payment = require("../models/Payment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const payment = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Order creation failed: ", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

const verify = async (req, res) => {
  const { uid, email } = req.user;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } =
    req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      await Payment.create({
        user: uid,
        email,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        status: "success",
      });

      res.status(200).json({ message: "Payment verified and saved" });
    } catch (error) {
      console.error("DB save error: ", error);
      res.status(500).json({ error: "Payment Varified, but DB save failed" });
    }
  } else {
    res.status(400).json({ message: "Invalid Signature" });
  }
};

const userPayments = async (req, res) => {
  try {
    const { uid } = req.user;
    const payments = await Payment.find({ user: uid }).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("payment fetch error for user", error);
    res.status(500).json({ error: "Failed to fetch the payments" });
  }
};

const adminPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("payment fetch error for admin", error);
    res.status(500).json({ error: "Failed to fetch the payments" });
  }
};

module.exports = { payment, verify, userPayments, adminPayments };
