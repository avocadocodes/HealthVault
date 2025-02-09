
const express = require("express");
const { register, login,verify } = require("../controllers/authController");
const router = express.Router();



router.post("/register", register);
router.post("/verify",verify)
router.post("/login", login);

module.exports = router;                