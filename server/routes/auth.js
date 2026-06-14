const express = require("express");
const router = express.Router();
const {
  sendOtp,
  sendRegisterOtp,
  verifyOtp,
  loginWithPassword,
  register,
  forgotPasswordSendOtp,
  forgotPasswordVerifyOtp,
  resetPassword,
} = require("../controllers/authController");

// OTP Login
router.post("/send-otp", sendOtp);
router.post("/register/send-otp", sendRegisterOtp);
router.post("/verify-otp", verifyOtp);

// Password Login
router.post("/login", loginWithPassword);

// Register
router.post("/register", register);

// Forgot Password
router.post("/forgot-password/send-otp", forgotPasswordSendOtp);
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOtp);
router.post("/forgot-password/reset", resetPassword);

module.exports = router;