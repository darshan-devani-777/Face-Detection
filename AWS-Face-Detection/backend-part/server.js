require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(express.json());

app.use(
    cors({
      origin: process.env.FRONTEND_URL,   
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, '0.0.0.0' , () =>
    console.log(`Server start at http://localhost:${process.env.PORT}`)
);
