import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0f16] px-4 sm:px-6">
      
      <div
        className="
          w-full 
          max-w-[450px] 
          bg-[#11141b] 
          p-6 
          sm:p-10 
          rounded-2xl 
          shadow-2xl 
          border 
          border-gray-800/40 
          text-center
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-2">
          Welcome, <span className="text-blue-400">{user?.name}</span> 👋
        </h1>

        <p className="text-gray-300 text-base sm:text-lg">{user?.email}</p>

        <p className="text-green-400 mt-3 font-semibold text-sm sm:text-md">
          ✅ Face Login Successful
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-2 mt-6 bg-red-600 text-white rounded-xl 
            hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-900/40 cursor-pointer"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Home;
