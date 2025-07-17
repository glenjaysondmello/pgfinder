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
router.get("/user_logs", verifyToken, userPayments);
router.get("/admin_logs", verifyToken, verifyAdmin, adminPayments);

module.exports = router;
