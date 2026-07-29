const express = require("express");
const { issueCertificate, getMyCertificates } = require("../controllers/certificateController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/my", authorize("student"), getMyCertificates);
router.post("/", authorize("admin"), issueCertificate);

module.exports = router;
