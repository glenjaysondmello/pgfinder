const express = require("express");
const {verifyToken} = require("../middlewares/authMiddleware")
const {fetchCartItems, addToCart, removeFromCart} = require("../controllers/cartController")

const router = express.Router();

router.get("/getcart", verifyToken, fetchCartItems);
router.post("/addcart", verifyToken, addToCart);
router.delete("/removecart/:id", verifyToken, removeFromCart);

module.exports = router;
