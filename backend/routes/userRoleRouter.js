const express = require("express");
const getUserRole = require("../controllers/userRoleController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getUserRole/:uid", getUserRole);

module.exports = router;