const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendTokenResponse } = require("../utils/jwtToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: "User already exists with that email" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student", // default to student if not provided
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Please provide an email and password" });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ success: false, error: "Your account is deactivated" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: "No refresh token provided" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user with this refresh token
    const user = await User.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid refresh token" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid refresh token" });
  }
};

// @desc    Log user out / clear refresh token
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      refreshToken: null
    });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
