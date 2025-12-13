// src/screens/OTPVerify.jsx
import React, { useState } from "react";

export default function OTPVerify({ setCurrentScreen }) {
  const [otpInput, setOtpInput] = useState("");

  const handleVerify = () => {
    const savedOtp = localStorage.getItem("user_otp");

    if (!otpInput) {
      alert("Please enter OTP");
      return;
    }

    if (otpInput === savedOtp) {
      alert("OTP verified successfully");
      localStorage.removeItem("user_otp");
      setCurrentScreen("dashboard");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="p-8 flex flex-col justify-center h-full bg-indigo-50">
      <h2 className="text-2xl font-bold mb-4 text-center">OTP Verification</h2>

      <input
        type="text"
        maxLength={6}
        className="border p-3 rounded mb-4 text-center text-lg tracking-widest"
        placeholder="Enter OTP"
        value={otpInput}
        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
      />

      <button
        onClick={handleVerify}
        className="bg-indigo-600 text-white py-3 rounded-xl font-bold"
      >
        Verify OTP
      </button>
    </div>
  );
}
