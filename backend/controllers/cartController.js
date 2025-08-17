const { mongoose } = require("mongoose");
const Cart = require("../models/Cart");
const redisClient = require("../redis/redisClient");

const CACHE_TTL = 1800;

const addToCart = async (req, res) => {
  try {
    const { uid } = req.user;
    const { pgId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: uid });

    const pgObjectId = new mongoose.Types.ObjectId(pgId);

    if (!cart) {
      cart = new Cart({ userId: uid, items: [{ pgId: pgObjectId, quantity }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.pgId.toString() === pgObjectId.toString()
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ pgId: pgObjectId, quantity });
      }
    }

    await cart.save();

    await redisClient.del(`cart:${uid}`);

    res.json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    res.status(500).json({ error: "Error adding item to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const cart = await Cart.findOne({ userId: uid });
    const pgObjectId = new mongoose.Types.ObjectId(id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.pgId.toString() !== pgObjectId.toString()
    );
    await cart.save();

    await redisClient.del(`cart:${uid}`);

    res.json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: "Error removing item to cart" });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { uid } = req.user;
    const cacheKey = `cart:${uid}`;

    const cachedCart = await redisClient.get(cacheKey);

    if (cachedCart) {
      console.log("Serving Cart from Redis cache");
      return res.json(JSON.parse(cachedCart));
    }

    const cart = await Cart.findOne({ userId: uid }).populate("items.pgId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.pgId !== null);

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(cart));

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
};

module.exports = { fetchCartItems, addToCart, removeFromCart };
