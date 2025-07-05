const express = require("express");
const {
  payment,
  verify,
  payments,
} = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/payment", verifyToken, payment);
router.post("/verify", verifyToken, verify);
router.get("/payments", verifyToken, payments);

module.exports = router;
