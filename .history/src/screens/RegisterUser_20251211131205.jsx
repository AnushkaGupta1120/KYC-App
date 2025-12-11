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

    const userData = {
      name,
      mobile,
      password,
    };

    // Save user to localStorage
    localStorage.setItem("user_account", JSON.stringify(userData));

    alert("Registered successfully!");

    // Go to login
    setCurrentScreen("user_login");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        className="w-full border p-3 rounded mb-3"
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded mb-3"
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
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
