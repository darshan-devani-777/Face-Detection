const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    faceId: String,
    imagePath: String
});

module.exports = mongoose.model("User", userSchema);
