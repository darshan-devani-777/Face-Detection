import Face from "../models/Face.js";
import { recognizeFace } from "../services/faceService.js";
import fs from "fs";

export const uploadFace = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const filePath = req.file.path;

        const results = await recognizeFace(filePath);

        const faceDoc = await Face.create({
            name: req.body.name || "Unknown",
            imageUrl: filePath,
            recognized: Array.isArray(results.result) && results.result.length > 0,
            comprefaceResponse: results
        });

        fs.unlinkSync(filePath);

        res.json({ message: "Face processed successfully...", face: faceDoc });
    } catch (err) {
        console.error("uploadFace error:", err?.response?.data || err.message || err);
        res.status(500).json({ message: "Server error", error: err?.message || err });
    }
};
