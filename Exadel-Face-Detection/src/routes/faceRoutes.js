import express from "express";
import multer from "multer";
import { uploadFace } from "../controllers/faceController.js";

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "src/uploads/"),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, unique + "-" + file.originalname);
    }
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadFace);

export default router;
