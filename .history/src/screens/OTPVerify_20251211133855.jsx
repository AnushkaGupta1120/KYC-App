import React, { useState } from "react";

export default function OTPVerify({ setCurrentScreen }) {
  const [otpInput, setOtpInput] = useState("");

  const handleVerify = () => {
    const savedOtp = localStorage.getItem("user_otp");

    if (otpInput === savedOtp) {
      alert("OTP verified!");

      // login success
      localStorage.setItem("is_logged_in", "true");

      setCurrentScreen("dashboard");
    } else {
      alert("Incorrect OTP");
    }
  };

  const resendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("user_otp", newOtp);
    alert("New OTP: " + newOtp);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

      <input
        className="w-full border p-3 rounded mb-3"
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otpInput}
        maxLength={6}
        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
      />

      <button
        className="w-full bg-indigo-600 text-white py-3 rounded-xl mb-3"
        onClick={handleVerify}
      >
        Verify OTP
      </button>

      <button
        className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl"
        onClick={resendOtp}
      >
        Resend OTP
      </button>
    </div>
  );
}
