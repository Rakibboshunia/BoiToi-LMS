const express = require("express");
const {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  updateDetails,
  uploadAvatar
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/avatar", protect, uploadAvatar);
router.post("/logout", protect, logout);

module.exports = router;
