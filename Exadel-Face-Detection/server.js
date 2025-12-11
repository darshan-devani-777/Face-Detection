import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import faceRoutes from "./src/routes/faceRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/faces", faceRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the CompreFace demo API");
});

const startServer = async () => {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server start At http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
    }
};

startServer();
