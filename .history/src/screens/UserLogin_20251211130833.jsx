import React, { useState } from "react";

export default function UserLogin({ setCurrentScreen, setUserRole, setUserId }) {
  const [mobile, setMobile] = useState("");

  const handleLogin = () => {
    if (!mobile || mobile.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }

    // ⭐ Save login persistently
    localStorage.setItem("is_logged_in", "true");
    localStorage.setItem("user_id", mobile);

    // ⭐ Store user ID in React state
    setUserId(mobile);
    setUserRole("user");

    // Continue to OTP or dashboard (depending on your design)
    setCurrentScreen("otp_verify");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Login</h2>

      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl"
      >
        Continue
      </button>
    </div>
  );
}
