import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";
import WebcamCapture from "../components/WebcamCapture";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Auto-login when image updates
  useEffect(() => {
    if (capturedImage) {
      handleLogin();
    }
  }, [capturedImage]);

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append("image", capturedImage);

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("🎉 Face Detected! Logging in...");

      setTimeout(() => navigate("/home"), 700);
    } catch (err) {
      setMsg("⏳ Scanning... Face not matched yet");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0f16] px-4 sm:px-6">
      <div
        className="
          w-full 
          max-w-[430px] 
          bg-[#11141b] 
          shadow-2xl 
          rounded-2xl 
          p-6 
          sm:p-8 
          border 
          border-gray-500/30
        "
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white tracking-wide">
          Login with <span className="text-blue-400">Face ID</span>
        </h2>

        <div className="w-full flex justify-center">
          <WebcamCapture
            onCapture={(file) => setCapturedImage(file)}
            autoClose={true}
          />
        </div>

        {/* Register button remains */}
        <button
          onClick={() => navigate("/register")}
          className="w-full py-2 mt-6 bg-green-600 text-white rounded-xl 
            hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-900/40 cursor-pointer"
        >
          New User? Register
        </button>

        <p className="text-center text-md font-semibold mt-3 text-gray-300">
          {msg}
        </p>
      </div>
    </div>
  );
};

export default Login;
