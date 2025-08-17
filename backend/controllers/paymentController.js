const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const Payment = require("../models/Payment");
const fs = require("fs");
const path = require("path");
const PgRoom = require("../models/PgRoom");
const redisClient = require("../redis/redisClient");

const CACHE_TTL = 1800;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const payment = async (req, res) => {
  const { pgId, amount } = req.body;

  if (!pgId && !amount)
    return res.status(400).json({ error: "pgId or amount is missing" });

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
  const { uid, email, name } = req.user;
  const {
    pgId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
  } = req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const paymentData = await Payment.create({
        user: uid,
        pgId,
        email,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        status: "success",
      });

      await redisClient.del(`user:${uid}:payments`);
      await redisClient.del("admin:payments");

      const invoiceDir = path.join(__dirname, "../invoices");

      if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

      const doc = new PDFDocument();

      const invoicePath = path.join(
        invoiceDir,
        `invoice-${paymentData._id}.pdf`
      );

      doc.pipe(fs.createWriteStream(invoicePath));

      doc.fontSize(20).text("PG Booking Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Invoice ID: ${paymentData._id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.text(`PG ID: ${pgId}`);
      doc.text(`Booked By: ${name} (${email})`);
      doc.text(`Amount Paid: Rs.${amount}`);
      doc.end();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const pg = await PgRoom.findById(pgId);

      if (!pg) {
        console.error("PG not found for email notification");
        return res.status(404).json({ error: "PG not found" });
      }

      const ownerMailOptions = {
        from: `"MY PG" <${process.env.EMAIL_USER}>`,
        to: pg.email,
        subject: "Your PG has been booked!",
        text: `Hi ${pg.email},\n\nYour PG (${pg.name}) was booked by ${name} (${email}).\n\nInvoice attached.`,
        attachments: [
          {
            filename: `invoice-${paymentData._id}.pdf`,
            path: invoicePath,
          },
        ],
      };
      await transporter.sendMail(ownerMailOptions);

      const userMailOptions = {
        from: `"MY PG" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "PG Booking Confirmation",
        text: `Hi ${name},\n\nThank you for booking ${pg.name}.\n\nYour receipt is attached.`,
        attachments: [
          {
            filename: `receipt-${paymentData._id}.pdf`,
            path: invoicePath,
          },
        ],
      };
      await transporter.sendMail(userMailOptions);

      console.log("Emails sent to PG owner and user");

      res
        .status(200)
        .json({ message: "Payment verified and saved, Emails sent" });
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
    const cacheKey = `user:${uid}:payments`;

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log("Serving user payments from Redis");
      return res.status(200).json(JSON.parse(cached));
    }

    const payments = await Payment.find({ user: uid }).sort({ createdAt: -1 });

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(payments));

    res.status(200).json(payments);
  } catch (error) {
    console.error("payment fetch error for user", error);
    res.status(500).json({ error: "Failed to fetch the payments" });
  }
};

const adminPayments = async (req, res) => {
  try {
    const cacheKey = "admin:payments";

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log("Serving admin payments from Redis");
      return res.status(200).json(JSON.parse(cached));
    }

    const payments = await Payment.find().sort({ createdAt: -1 });

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(payments));

    res.status(200).json(payments);
  } catch (error) {
    console.error("payment fetch error for admin", error);
    res.status(500).json({ error: "Failed to fetch the payments" });
  }
};

module.exports = { payment, verify, userPayments, adminPayments };
