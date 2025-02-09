
const express = require("express");
const { register, login,verify ,forgotpassoword,resetpassword} = require("../controllers/authController");
const router = express.Router();



router.post("/register", register);
router.post("/verify",verify)
router.post("/login", login);
router.post("/forgotpassword", forgotpassoword);
router.post("/resetpassword", resetpassword);

module.exports = router;                