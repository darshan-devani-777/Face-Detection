const path = require("path");
const fs = require("fs");
const rekognition = require("../config/aws");
const { SearchFacesByImageCommand } = require("@aws-sdk/client-rekognition");

const {
  IndexFacesCommand,
  SearchFacesByImageCommand,
} = require("@aws-sdk/client-rekognition");

const User = require("../models/User");

const COLLECTION = "users";

// Check Live Face
exports.checkLiveFace = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image data received. Only live webcam data is allowed.",
      });
    }

    const imgBuffer = fs.readFileSync(req.file.path);

    const searchCommand = new SearchFacesByImageCommand({
      CollectionId: COLLECTION,
      Image: { Bytes: imgBuffer },
      MaxFaces: 1,
      FaceMatchThreshold: 90, 
    });

    const result = await rekognition.send(searchCommand);

    if (!result.FaceMatches || result.FaceMatches.length === 0) {
      return res.json({
        success: true,
        message: "Live face detected, proceed with registration/login.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Static photo detected. Please provide a live face.",
    });
  } catch (error) {
    console.error("Error checking live face:", error);
    res.status(500).json({
      success: false,
      message: "Error checking live face. Please try again.",
    });
  }
};

// REGISTER
exports.register = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: `User with email "${email}" already exists. Please use another email.`,
      });
    }

    const savePath = req.file.path;

    const imgBuffer = fs.readFileSync(savePath);

    const index = new IndexFacesCommand({
      CollectionId: COLLECTION,
      Image: { Bytes: imgBuffer },
      MaxFaces: 1,
    });

    const result = await rekognition.send(index);

    if (!result.FaceRecords || result.FaceRecords.length === 0) {
      fs.unlinkSync(savePath);

      return res.status(400).json({
        success: false,
        message: "Face not detected. Please upload a clear front-face image.",
      });
    }

    const faceId = result.FaceRecords[0].Face.FaceId;

    const user = await User.create({
      name,
      email,
      faceId,
      imagePath: savePath,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully...",
      userId: user._id,
      faceId,
      imagePath: savePath,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const savePath = req.file.path;

    const imgBuffer = fs.readFileSync(savePath);

    const search = new SearchFacesByImageCommand({
      CollectionId: COLLECTION,
      Image: { Bytes: imgBuffer },
      MaxFaces: 1,
      FaceMatchThreshold: 90,
    });

    const result = await rekognition.send(search);

    if (!result.FaceMatches || result.FaceMatches.length === 0) {
      fs.unlinkSync(savePath);
      return res.status(401).json({
        success: false,
        message: "Face not matched. Please try again with a clear image.",
      });
    }

    const faceId = result.FaceMatches[0].Face.FaceId;

    const user = await User.findOne({ faceId });

    if (!user) {
      fs.unlinkSync(savePath); 
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    fs.unlinkSync(savePath); 

    return res.json({
      success: true,
      message: "User login successfully...",
      user: {
        id: user._id,
        name: user.name,
        image: user.imagePath,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

