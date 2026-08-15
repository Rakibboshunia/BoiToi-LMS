
const jwt = require("jsonwebtoken");

// Generate access and refresh tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });

  return { accessToken, refreshToken };
};

// Send token response
const sendTokenResponse = async (user, statusCode, res) => {
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token in user document
  user.refreshToken = refreshToken;
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  // Remove password and tokens from output
  user.password = undefined;
  user.refreshToken = undefined;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken, // In a production app, refreshToken should be in a secure HttpOnly cookie
    user,
  });
};


module.exports = { generateTokens, sendTokenResponse };
