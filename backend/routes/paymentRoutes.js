const express = require("express");
const {payment, verify, payments} = require("../controllers/paymentController");

const router = express.Router();

router.post("/payment", payment);
router.post("/verify", verify);
router.get("/payments", payments);

module.exports = router;