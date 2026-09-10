const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "top_secret_dev_key";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      dob: user.dob
    };
    const token = jwt.sign({ user: safeUser }, JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ token, user: safeUser, message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
