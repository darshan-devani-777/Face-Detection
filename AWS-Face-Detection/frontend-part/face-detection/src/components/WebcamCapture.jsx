import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 420,
  height: 300,
  facingMode: "user",
};

const WebcamCapture = ({ onCapture, autoClose }) => {
  const webcamRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [message, setMessage] = useState("");

  // Auto scanning
  useEffect(() => {
    if (!cameraOn) return;

    const interval = setInterval(() => {
      captureImage();
    }, 1200);

    return () => clearInterval(interval);
  }, [cameraOn]);

  // CAMERA START ATTEMPT
  const startCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraOn(true);
    } catch (err) {
      alert("Camera not ready!");
      setCameraOn(false);
    }
  };

  const captureImage = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setPreview(imageSrc);

    fetch(imageSrc)
      .then((res) => res.blob())
      .then(async (blob) => {
        const file = new File([blob], "face.jpg", { type: "image/jpeg" });

        try {
          const formData = new FormData();
          formData.append("image", file);

          const res = await fetch("/api/check-live-face", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (!data.success) {
            setMessage(data.message);
            return;
          }

          onCapture(file); 
          setMessage(""); 

          if (autoClose) {
            setCameraOn(false);
          }
        } catch (error) {
          setMessage("Error processing live face check.");
        }
      });
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {/* BLACK BOX */}
      {!cameraOn && (
        <div className="rounded-xl border border-gray-700 shadow-lg bg-black w-full max-w-[420px] h-[300px]"></div>
      )}

      {/* CAMERA VIEW */}
      {cameraOn && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded-xl border border-gray-700 shadow-lg bg-black w-full max-w-[420px] h-[300px] object-cover"
        />
      )}

      {/* Capture Button */}
      {!cameraOn && (
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all active:scale-95 shadow-lg cursor-pointer"
        >
          Capture Face
        </button>
      )}

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="Captured"
          className="w-32 sm:w-40 rounded-xl border border-gray-700 shadow-lg"
        />
      )}

      {/* Message */}
      {message && (
        <p className="text-red-500 mt-2">{message}</p>
      )}
    </div>
  );
};

export default WebcamCapture;
