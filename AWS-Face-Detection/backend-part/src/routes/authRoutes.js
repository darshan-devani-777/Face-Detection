const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, path.join(__dirname, "..", "uploads")),
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

const authController = require("../controllers/authController");

router.post("/check-live-face", upload.single("image"), authController.checkLiveFace);
router.post("/register", upload.single("image"), authController.register);
router.post("/login", upload.single("image"), authController.login);

module.exports = router;
