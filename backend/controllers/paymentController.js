const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const Payment = require("../models/Payment");
const PgRoom = require("../models/PgRoom");
const redisClient = require("../client/redisClient");

const CACHE_TTL = 1800;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const payment = async (req, res) => {
  const { pgId, amount } = req.body;
  if (!pgId || !amount)
    return res.status(400).json({ error: "pgId and amount are required" });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation failed: ", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

const verify = async (req, res) => {
  const { uid, email, name } = req.user;
  const {
    pgId,
    pgName,
    pgLocation,
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

  if (expectedSignature !== razorpay_signature)
    return res.status(400).json({ message: "Invalid Signature" });

  try {
    const paymentRecord = await Payment.create({
      user: uid,
      pgId,
      pgName,
      pgLocation,
      email,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      status: "success",
    });

    await redisClient.del(`user:${uid}:payments`);
    await redisClient.del("admin:payments");

    const generatePdfBuffer = ({ userData, pgData, paymentData }) => {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: 0 });
        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err) => reject(err));

        // Enhanced Color Palette
        const brandColor = "#2563EB";
        const accentColor = "#3B82F6";
        const darkGray = "#1F2937";
        const mediumGray = "#4B5563";
        const lightGray = "#6B7280";
        const extraLightGray = "#F3F4F6";
        const white = "#FFFFFF";
        const successGreen = "#10B981";

        // Layout Constants
        const pageMargin = 60;
        const headerHeight = 120;
        const contentWidth = doc.page.width - pageMargin * 2;
        const leftColumnWidth = contentWidth * 0.6;
        const rightColumnX = pageMargin + leftColumnWidth + 30;
        const rightColumnWidth = contentWidth - leftColumnWidth - 30;

        // Helper Functions
        const drawRect = (x, y, width, height, color, radius = 0) => {
          doc.fillColor(color);
          if (radius > 0) {
            doc.roundedRect(x, y, width, height, radius).fill();
          } else {
            doc.rect(x, y, width, height).fill();
          }
        };

        const drawLine = (x1, y1, x2, y2, color = "#E5E7EB", width = 1) => {
          doc
            .strokeColor(color)
            .lineWidth(width)
            .moveTo(x1, y1)
            .lineTo(x2, y2)
            .stroke();
        };

        const formatCurrency = (amt) =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
          }).format(amt);

        const addShadowEffect = (x, y, width, height) => {
          // Subtle shadow effect
          drawRect(x + 2, y + 2, width, height, "#00000010", 8);
        };

        // Header Section with Gradient Background
        drawRect(0, 0, doc.page.width, headerHeight, brandColor);

        // Add subtle gradient effect
        const gradient = doc.linearGradient(0, 0, 0, headerHeight);
        gradient.stop(0, brandColor).stop(1, accentColor);
        doc.fillColor(gradient).rect(0, 0, doc.page.width, headerHeight).fill();

        // Company Logo/Name
        doc
          .fillColor(white)
          .fontSize(28)
          .font("Helvetica-Bold")
          .text("PG Finder", pageMargin, pageMargin + 20);

        // Tagline
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(
            "Your Premium PG Booking Solution",
            pageMargin,
            pageMargin + 55
          );

        // Invoice Title
        doc
          .fontSize(24)
          .font("Helvetica-Bold")
          .text("INVOICE", rightColumnX, pageMargin + 20, {
            width: rightColumnWidth,
            align: "right",
          });

        // Current Y position after header
        let currentY = headerHeight + 40;

        // Invoice Details Card
        const invoiceCardY = currentY;
        const invoiceCardHeight = 100;

        // Shadow effect for invoice details card
        addShadowEffect(
          pageMargin,
          invoiceCardY,
          contentWidth,
          invoiceCardHeight
        );
        drawRect(
          pageMargin,
          invoiceCardY,
          contentWidth,
          invoiceCardHeight,
          white,
          12
        );

        // Invoice Details Content
        const invoiceDetailsY = invoiceCardY + 25;

        doc
          .fontSize(11)
          .fillColor(lightGray)
          .font("Helvetica-Bold")
          .text("INVOICE DETAILS", pageMargin + 25, invoiceDetailsY);

        const invoiceDetails = [
          {
            label: "Invoice Number",
            value: `#${paymentData._id.slice(-8).toUpperCase()}`,
          },
          {
            label: "Issue Date",
            value: new Date().toLocaleDateString("en-GB"),
          },
          { label: "Due Date", value: new Date().toLocaleDateString("en-GB") },
        ];

        let detailY = invoiceDetailsY + 20;
        invoiceDetails.forEach(({ label, value }) => {
          doc
            .fontSize(10)
            .fillColor(mediumGray)
            .font("Helvetica")
            .text(`${label}:`, pageMargin + 25, detailY);
          doc
            .fillColor(darkGray)
            .font("Helvetica-Bold")
            .text(value, pageMargin + 120, detailY);
          detailY += 15;
        });

        // Payment Status Badge
        const badgeX = rightColumnX + 20;
        const badgeY = invoiceDetailsY + 15;
        const badgeWidth = 80;
        const badgeHeight = 25;

        drawRect(badgeX, badgeY, badgeWidth, badgeHeight, successGreen, 15);
        doc
          .fontSize(10)
          .fillColor(white)
          .font("Helvetica-Bold")
          .text("PAID", badgeX, badgeY + 8, {
            width: badgeWidth,
            align: "center",
          });

        currentY = invoiceCardY + invoiceCardHeight + 40;

        // Billing Information Section
        const billingCardY = currentY;
        const billingCardHeight = 120;

        // Left side - Bill To
        addShadowEffect(
          pageMargin,
          billingCardY,
          leftColumnWidth,
          billingCardHeight
        );
        drawRect(
          pageMargin,
          billingCardY,
          leftColumnWidth,
          billingCardHeight,
          white,
          12
        );

        doc
          .fontSize(11)
          .fillColor(lightGray)
          .font("Helvetica-Bold")
          .text("BILL TO", pageMargin + 25, billingCardY + 25);

        doc
          .fontSize(16)
          .fillColor(darkGray)
          .font("Helvetica-Bold")
          .text(userData.name, pageMargin + 25, billingCardY + 50);

        doc
          .fontSize(12)
          .fillColor(mediumGray)
          .font("Helvetica")
          .text(userData.email, pageMargin + 25, billingCardY + 72);

        if (userData.phone) {
          doc.text(userData.phone, pageMargin + 25, billingCardY + 90);
        }

        // Right side - Service Details
        addShadowEffect(
          rightColumnX,
          billingCardY,
          rightColumnWidth,
          billingCardHeight
        );
        drawRect(
          rightColumnX,
          billingCardY,
          rightColumnWidth,
          billingCardHeight,
          extraLightGray,
          12
        );

        doc
          .fontSize(11)
          .fillColor(lightGray)
          .font("Helvetica-Bold")
          .text("SERVICE DETAILS", rightColumnX + 20, billingCardY + 25);

        doc
          .fontSize(14)
          .fillColor(darkGray)
          .font("Helvetica-Bold")
          .text("PG Booking", rightColumnX + 20, billingCardY + 50);

        doc
          .fontSize(11)
          .fillColor(mediumGray)
          .font("Helvetica")
          .text("Premium Accommodation", rightColumnX + 20, billingCardY + 72);

        currentY = billingCardY + billingCardHeight + 40;

        // Main Content Table
        const tableY = currentY;
        const tableHeight = 180;

        addShadowEffect(pageMargin, tableY, contentWidth, tableHeight);
        drawRect(pageMargin, tableY, contentWidth, tableHeight, white, 12);

        // Table Header
        const tableHeaderY = tableY + 25;
        drawRect(
          pageMargin + 15,
          tableHeaderY,
          contentWidth - 30,
          35,
          extraLightGray,
          8
        );

        doc
          .fontSize(11)
          .fillColor(darkGray)
          .font("Helvetica-Bold")
          .text("DESCRIPTION", pageMargin + 30, tableHeaderY + 12);

        doc.text("AMOUNT", pageMargin + contentWidth - 100, tableHeaderY + 12, {
          width: 70,
          align: "right",
        });

        // Table Content
        const tableContentY = tableHeaderY + 50;

        // PG Icon (simple rectangle to represent accommodation)
        drawRect(pageMargin + 30, tableContentY, 40, 30, brandColor, 4);
        doc
          .fontSize(8)
          .fillColor(white)
          .font("Helvetica-Bold")
          .text("PG", pageMargin + 45, tableContentY + 11, { align: "center" });

        // Service Description
        doc
          .fontSize(14)
          .fillColor(darkGray)
          .font("Helvetica-Bold")
          .text(pgData.name, pageMargin + 85, tableContentY);

        doc
          .fontSize(11)
          .fillColor(mediumGray)
          .font("Helvetica")
          .text(`📍 ${pgData.location}`, pageMargin + 85, tableContentY + 20);

        // Booking period (if available)
        if (pgData.bookingPeriod) {
          doc
            .fontSize(10)
            .fillColor(lightGray)
            .text(
              `Period: ${pgData.bookingPeriod}`,
              pageMargin + 85,
              tableContentY + 38
            );
        }

        // Amount
        doc
          .fontSize(16)
          .fillColor(darkGray)
          .font("Helvetica-Bold")
          .text(
            formatCurrency(paymentData.amount),
            pageMargin + contentWidth - 100,
            tableContentY + 5,
            {
              width: 70,
              align: "right",
            }
          );

        // Subtotal section
        const subtotalY = tableY + tableHeight - 70;
        drawLine(
          pageMargin + contentWidth - 200,
          subtotalY,
          pageMargin + contentWidth - 30,
          subtotalY,
          lightGray
        );

        // Subtotal
        doc
          .fontSize(11)
          .fillColor(mediumGray)
          .font("Helvetica")
          .text("Subtotal:", pageMargin + contentWidth - 150, subtotalY + 15);

        doc
          .fillColor(darkGray)
          .font("Helvetica-Bold")
          .text(
            formatCurrency(paymentData.amount),
            pageMargin + contentWidth - 100,
            subtotalY + 15,
            {
              width: 70,
              align: "right",
            }
          );

        // Tax (if applicable)
        const taxAmount = paymentData.tax || 0;
        if (taxAmount > 0) {
          doc
            .fontSize(11)
            .fillColor(mediumGray)
            .font("Helvetica")
            .text(
              "Tax (18% GST):",
              pageMargin + contentWidth - 150,
              subtotalY + 32
            );

          doc
            .fillColor(darkGray)
            .font("Helvetica-Bold")
            .text(
              formatCurrency(taxAmount),
              pageMargin + contentWidth - 100,
              subtotalY + 32,
              {
                width: 70,
                align: "right",
              }
            );
        }

        currentY = tableY + tableHeight + 20;

        // Total Section
        const totalY = currentY;
        const totalHeight = 60;

        drawRect(
          pageMargin + contentWidth - 250,
          totalY,
          250,
          totalHeight,
          brandColor,
          12
        );

        doc
          .fontSize(14)
          .fillColor(white)
          .font("Helvetica-Bold")
          .text("TOTAL PAID", pageMargin + contentWidth - 230, totalY + 15);

        doc
          .fontSize(18)
          .font("Helvetica-Bold")
          .text(
            formatCurrency(paymentData.amount + (taxAmount || 0)),
            pageMargin + contentWidth - 230,
            totalY + 35,
            {
              width: 210,
              align: "right",
            }
          );

        // Footer Section
        const footerY = doc.page.height - 120;

        // Footer background
        drawRect(0, footerY, doc.page.width, 120, extraLightGray);

        // Thank you message
        doc
          .fontSize(16)
          .fillColor(darkGray)
          .font("Helvetica-Bold")
          .text("Thank you for choosing PG Finder!", pageMargin, footerY + 30, {
            width: contentWidth,
            align: "center",
          });

        doc
          .fontSize(11)
          .fillColor(mediumGray)
          .font("Helvetica")
          .text(
            "We appreciate your business and hope you enjoy your stay.",
            pageMargin,
            footerY + 52,
            {
              width: contentWidth,
              align: "center",
            }
          );

        // Contact information
        doc
          .fontSize(10)
          .fillColor(lightGray)
          .text(
            "Questions? Contact us at support@pgfinder.com | +91-XXX-XXX-XXXX",
            pageMargin,
            footerY + 75,
            {
              width: contentWidth,
              align: "center",
            }
          );

        // Company address
        doc.text(
          "PG Finder Pvt Ltd. | Bangalore, Karnataka, India",
          pageMargin,
          footerY + 90,
          {
            width: contentWidth,
            align: "center",
          }
        );

        doc.end();
      });
    };

    const pdfBuffer = await generatePdfBuffer({
      userData: { name, email },
      pgData: { name: pgName, location: pgLocation },
      paymentData: {
        _id: paymentRecord._id.toString(),
        amount: paymentRecord.amount,
      },
    });

    const pg = await PgRoom.findById(pgId);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"MY PG" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "PG Booking Confirmation & Receipt",
      text: `Hi ${name},\n\nThank you for booking ${pgName}.\n\nYour receipt is attached.`,
      attachments: [
        {
          filename: `receipt-${paymentRecord._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    if (pg && pg.email) {
      await transporter.sendMail({
        from: `"MY PG" <${process.env.EMAIL_USER}>`,
        to: pg.email,
        subject: "Notification: Your PG Has Been Booked!",
        text: `Hi,\n\nYour PG (${pgName}) was booked by ${name} (${email}).\n\nThe invoice is attached for your records.`,
        attachments: [
          {
            filename: `invoice-${paymentRecord._id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    }

    res.status(200).json({
      message: "Payment verified, saved, and confirmation emails sent.",
    });
  } catch (error) {
    console.error("Error during payment verification process: ", error);
    res.status(500).json({
      error: "Payment was verified, but failed to save details or send emails.",
    });
  }
};

const userPayments = async (req, res) => {
  try {
    const { uid } = req.user;
    const cacheKey = `user:${uid}:payments`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const payments = await Payment.find({ user: uid })
      .sort({ createdAt: -1 })
      .lean();
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(payments));
    res.status(200).json(payments);
  } catch (error) {
    console.error("User payment fetch error: ", error);
    res.status(500).json({ error: "Failed to fetch payment history." });
  }
};

const adminPayments = async (req, res) => {
  try {
    const cacheKey = "admin:payments";
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const payments = await Payment.find().sort({ createdAt: -1 }).lean();
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(payments));
    res.status(200).json(payments);
  } catch (error) {
    console.error("Admin payment fetch error: ", error);
    res.status(500).json({ error: "Failed to fetch all payment logs." });
  }
};

module.exports = { payment, verify, userPayments, adminPayments };

// const invoiceDir = path.join(__dirname, "../invoices");

// if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

// const doc = new PDFDocument();

// const invoicePath = path.join(
//   invoiceDir,
//   `invoice-${paymentData._id}.pdf`
// );

// doc.pipe(fs.createWriteStream(invoicePath));

// doc.fontSize(20).text("PG Booking Invoice", { align: "center" });
// doc.moveDown();
// doc.fontSize(14).text(`Invoice ID: ${paymentData._id}`);
// doc.text(`Date: ${new Date().toLocaleDateString()}`);
// doc.text(`PG ID: ${pgId}`);
// doc.text(`Booked By: ${name} (${email})`);
// doc.text(`Amount Paid: Rs.${amount}`);
// doc.end();
