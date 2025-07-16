const express = require("express");
const {
  payment,
  verify,
  userPayments,
  adminPayments,
} = require("../controllers/paymentController");
const { verifyAdmin, verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/payment", verifyToken, payment);
router.post("/verify", verifyToken, verify);
router.get("/payments", verifyToken, userPayments);
router.get("/payments", verifyAdmin, verifyToken, adminPayments);

module.exports = router;
