const mongoose = require('mongoose');

const FaceDataSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  faces: [
    {
      boundingBox: {
        top: { type: Number, required: true },
        left: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
      },
      confidence: { type: Number, required: true },
      landmarks: [
        {
          type: { type: String, required: true },
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
      ],
      emotions: [
        {
          type: { type: String, required: true },
          confidence: { type: Number, required: true },
        },
      ],
      ageRange: {
        low: { type: Number, required: true },
        high: { type: Number, required: true },
      },
      gender: {
        value: { type: String, required: true },
        confidence: { type: Number, required: true },
      },
      smile: {
        value: { type: Boolean, required: true },
        confidence: { type: Number, required: true },
      },
      eyeglasses: {
        value: { type: Boolean, required: true },
        confidence: { type: Number, required: true },
      },
      sunglasses: {
        value: { type: Boolean, required: true },
        confidence: { type: Number, required: true },
      },
    },
  ],
});

module.exports = mongoose.model('FaceData', FaceDataSchema);
