
const express = require("express");
const { register, login,verify ,forgotpassoword,resetpassword,logout} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/verify",verify)
router.post("/login", login);
router.post("/forgotpassword", forgotpassoword);
router.post("/resetpassword", resetpassword);
router.get("/logout", logout);
module.exports = router;                