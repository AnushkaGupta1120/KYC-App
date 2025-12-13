import React, { useState } from "react";

export default function RegisterUser({ setCurrentScreen }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !mobile || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    const userData = { name, mobile, password };
    localStorage.setItem("user_account", JSON.stringify(userData));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("user_otp", otp);

    console.log("OTP:", otp);
    alert("OTP sent successfully");

    // setCurrentScreen("OTP_VERIFY");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
        maxLength={10}
      />

      <input
        className="w-full border p-3 rounded mb-3"
        type="password"
        placeholder="Create Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-indigo-600 text-white py-3 rounded-xl"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}
