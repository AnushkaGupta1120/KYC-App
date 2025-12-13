import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function UserLogin({ setCurrentScreen, setUserRole, setUserId }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const saved = JSON.parse(localStorage.getItem("user_account"));

    if (!saved) {
      alert("No account found. Please register.");
      return;
    }

    if (saved.mobile !== mobile || saved.password !== password) {
      alert("Invalid mobile or password.");
      return;
    }

    // Login success
    localStorage.setItem("is_logged_in", "true");
    localStorage.setItem("user_id", mobile);

    setUserRole("user");
    setUserId(mobile);
    setCurrentScreen("dashboard");
  };

  return (
    <div className="p-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => setCurrentScreen("login")}
        className="flex items-center gap-2 text-indigo-600 mb-4 text-sm font-semibold"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h2 className="text-xl font-bold mb-4">User Login</h2>

      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="w-full border p-3 rounded mb-3"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
      >
        Continue
      </button>
    </div>
  );
}
