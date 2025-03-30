const express = require("express");
const getUserRole = require("../controllers/userRoleController");

const router = express.Router();

router.get("/getUserRole/:uid", getUserRole);

module.exports = router;