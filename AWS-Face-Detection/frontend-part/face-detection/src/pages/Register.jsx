import React, { useState } from "react";
import api from "../api/axiosClient";
import WebcamCapture from "../components/WebcamCapture";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({ name: "", email: "" });
  const [capturedImage, setCapturedImage] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!data.name || !data.email || !capturedImage)
      return alert("Please fill all fields and capture image!");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("image", capturedImage);

    try {
      const res = await api.post("/auth/register", formData);

      setMsg("🎉 User registration successfully...!");

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.log(err);
      setMsg("❌ Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0f16]">
      <div className="w-[430px] bg-[#11141b] shadow-2xl rounded-2xl p-8 border border-gray-500/30">
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">
          Register with <span className="text-blue-400">Face ID</span>
        </h2>

        {/* Full Name */}
        <label className="text-gray-300 text-sm">Full Name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Enter your name"
          className="w-full px-4 py-2 mt-1 mb-4 rounded-lg bg-[#1b1f29] text-white 
          border border-gray-600 focus:ring-1 focus:ring-blue-500 outline-none"
        />

        {/* Email */}
        <label className="text-gray-300 text-sm">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mt-1 mb-4 rounded-lg bg-[#1b1f29] text-white 
          border border-gray-600 focus:ring-1 focus:ring-blue-500 outline-none"
        />

        {/* Webcam */}
        <WebcamCapture
          onCapture={(file) => setCapturedImage(file)}
          autoClose={false}
        />

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded-xl
          hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-900/40 cursor-pointer"
        >
          Register
        </button>

        {/* Login Redirect */}
        <button
          onClick={() => navigate("/login")}
          className="w-full py-2 mt-3 bg-green-600 text-white rounded-xl
          hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-900/40 cursor-pointer"
        >
          Already Registered? Login
        </button>

        <p className="text-center text-md font-semibold mt-3 text-gray-300">
          {msg}
        </p>
      </div>
    </div>
  );
};

export default Register;
