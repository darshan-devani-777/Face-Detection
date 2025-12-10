const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadAndDetectFace } = require('../controller/faceController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/images');
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); 

const router = express.Router();

router.post('/upload', upload.single('image'), uploadAndDetectFace);

module.exports = router;
