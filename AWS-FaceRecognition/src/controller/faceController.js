const { DetectFacesCommand } = require("@aws-sdk/client-rekognition");
const fs = require("fs");
const FaceData = require("../models/faceDataModel");
const path = require("path");
const rekognitionClient = require("../config/awsConfig");

const detectFaces = async (imagePath) => {
  try {
    const imageBytes = fs.readFileSync(imagePath);

    const params = {
      Image: { Bytes: imageBytes },
      Attributes: ["ALL"],
    };

    const command = new DetectFacesCommand(params);
    const response = await rekognitionClient.send(command);

    if (response.FaceDetails.length === 0) {
      return { message: "No faces detected." };
    }

    const faceData = new FaceData({
      imagePath: imagePath,
      faces: response.FaceDetails.map((face) => ({
        boundingBox: {
          top: face.BoundingBox.Top,
          left: face.BoundingBox.Left,
          width: face.BoundingBox.Width,
          height: face.BoundingBox.Height,
        },
        confidence: face.Confidence,
        landmarks: face.Landmarks.map((landmark) => ({
          type: landmark.Type,
          x: landmark.X,
          y: landmark.Y,
        })),
        emotions: face.Emotions.map((emotion) => ({
          type: emotion.Type,
          confidence: emotion.Confidence,
        })),
        ageRange: {
          low: face.AgeRange.Low,
          high: face.AgeRange.High,
        },
        gender: {
          value: face.Gender.Value,
          confidence: face.Gender.Confidence,
        },
        smile: {
          value: face.Smile.Value,
          confidence: face.Smile.Confidence,
        },
        eyeglasses: {
          value: face.Eyeglasses.Value,
          confidence: face.Eyeglasses.Confidence,
        },
        sunglasses: {
          value: face.Sunglasses.Value,
          confidence: face.Sunglasses.Confidence,
        },
      })),
    });

    await faceData.save();
    return { success: true, data: faceData };
  } catch (error) {
    console.error("Error detecting faces:", error);
    throw new Error("Error processing image");
  }
};

const uploadAndDetectFace = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image uploaded. Please upload an image.",
    });
  }

  const imagePath = path.join(__dirname, "../public/images", req.file.filename);

  try {
    const faceDataResult = await detectFaces(imagePath);

    if (faceDataResult.message) {
      return res.status(404).json({
        success: false,
        message: faceDataResult.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Face detected successfully...",
      data: faceDataResult.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { uploadAndDetectFace };
