const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// ─── Send OTP (OTP Login) ────────────────────────────────────────────────────

async function sendOtp(req, res) {
  const { phone } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
  }

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "No account found with this phone number" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRES_MINUTES * 60 * 1000);

    await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);
    await pool.query(
      "INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3)",
      [phone, otp, expiresAt]
    );

    // TODO: Send OTP via SMS (Twilio etc.) — for now log to console
    console.log(`OTP for ${phone}: ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─── Send OTP (Registration) ─────────────────────────────────────────────────

async function sendRegisterOtp(req, res) {
  const { phone } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "An account with this phone number already exists" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRES_MINUTES * 60 * 1000);

    await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);
    await pool.query(
      "INSERT INTO otps (phone, otp, expires_at, purpose) VALUES ($1, $2, $3, 'register')",
      [phone, otp, expiresAt]
    );

    console.log(`Register OTP for ${phone}: ${otp}`);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendRegisterOtp error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─── Verify OTP ──────────────────────────────────────────────────────────────

async function verifyOtp(req, res) {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM otps WHERE phone = $1 AND otp = $2",
      [phone, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const otpRecord = result.rows[0];

    if (new Date() > new Date(otpRecord.expires_at)) {
      await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);
      return res.status(400).json({ message: "OTP has expired. Please request a new one" });
    }

    await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);

    // Check if user exists (login flow) or not (register flow)
    const userResult = await pool.query(
      "SELECT id, name, phone, role FROM users WHERE phone = $1",
      [phone]
    );

    if (userResult.rows.length > 0) {
      // Login flow — return token
      const user = userResult.rows[0];
      const token = generateToken(user.id, user.role);
      return res.status(200).json({ message: "OTP verified successfully", token, user });
    } else {
      // Register flow — user will be created in next step
      return res.status(200).json({ message: "OTP verified successfully" });
    }

  } catch (err) {
    console.error("verifyOtp error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─── Login with Password ─────────────────────────────────────────────────────

async function loginWithPassword(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(400).json({ message: "This account uses OTP login. Please use OTP instead" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("loginWithPassword error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─── Register ────────────────────────────────────────────────────────────────

async function register(req, res) {
  const { name, phone, email, password, childName, childAge } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
  }

  try {
    const phoneCheck = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );
    if (phoneCheck.rows.length > 0) {
      return res.status(409).json({ message: "An account with this phone number already exists" });
    }

    if (email) {
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }
    }

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const userResult = await pool.query(
      `INSERT INTO users (name, phone, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'parent') RETURNING id, name, phone, email, role`,
      [name, phone, email || null, passwordHash]
    );
    const user = userResult.rows[0];

    if (childName) {
      await pool.query(
        "INSERT INTO children (parent_id, name, age) VALUES ($1, $2, $3)",
        [user.id, childName, childAge || null]
      );
    }

    const token = generateToken(user.id, user.role);

    return res.status(201).json({ message: "Account created successfully", token, user });
  } catch (err) {
    console.error("register error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─── Forgot Password — Send OTP ──────────────────────────────────────────────

async function forgotPasswordSendOtp(req, res) {
  const { phone } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
  }

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "No account found with this phone number" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRES_MINUTES * 60 * 1000);

    await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);
    await pool.query(
      "INSERT INTO otps (phone, otp, expires_at, purpose) VALUES ($1, $2, $3, 'reset')",
      [phone, otp, expiresAt]
    );

    // TODO: Send via SMS
    console.log(`Password reset OTP for ${phone}: ${otp}`);

    return res.status(200).json({ message: "OTP sent to your phone" });
  } catch (err) {
    console.error("forgotPasswordSendOtp error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─── Forgot Password — Verify OTP ───────────────────────────────────────────

async function forgotPasswordVerifyOtp(req, res) {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM otps WHERE phone = $1 AND otp = $2 AND purpose = 'reset'",
      [phone, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(result.rows[0].expires_at)) {
      await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);
      return res.status(400).json({ message: "OTP has expired. Please request a new one" });
    }

    await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);

    const resetToken = jwt.sign(
      { phone, purpose: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({ message: "OTP verified", resetToken });
  } catch (err) {
    console.error("forgotPasswordVerifyOtp error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─── Forgot Password — Reset ─────────────────────────────────────────────────

async function resetPassword(req, res) {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "Reset token and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    if (decoded.purpose !== "reset") {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE phone = $2",
      [passwordHash, decoded.phone]
    );

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset session expired. Please start again" });
    }
    console.error("resetPassword error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  sendOtp,
  sendRegisterOtp,
  verifyOtp,
  loginWithPassword,
  register,
  forgotPasswordSendOtp,
  forgotPasswordVerifyOtp,
  resetPassword,
};