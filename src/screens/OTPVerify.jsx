import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function OTPVerify({ setCurrentScreen }) {
  const [otpInput, setOtpInput] = useState("");

  const pending = JSON.parse(localStorage.getItem("pendingRegistration"));

  if (!pending) {
    return (
      <div className="p-8 text-red-500 text-center">
        Registration data missing. Please register again.
      </div>
    );
  }

  const verifyOtp = () => {
    if (otpInput !== pending.otp) {
      alert("Incorrect OTP. Try again.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Save new user
    const newUser = {
      name: pending.name,
      mobile: pending.mobile,
      email: pending.email,
      userId: pending.userId,
      password: pending.password,
      kycStatus: "none",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Remove temporary OTP
    localStorage.removeItem("pendingRegistration");

    alert("Registration successful!");
    setCurrentScreen("login");
  };

  return (
    <div className="p-8 bg-gray-100 h-full">
      <button
        onClick={() => setCurrentScreen("register")}
        className="flex items-center text-gray-600 mb-4"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-4">OTP Verification</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter the OTP sent to {pending.mobile}
      </p>

      <div className="bg-white p-6 rounded-xl shadow">
        <input
          maxLength={6}
          placeholder="Enter OTP"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          className="w-full p-3 border rounded text-center text-lg tracking-widest"
        />

        <button
          onClick={verifyOtp}
          className="w-full bg-indigo-600 text-white p-3 mt-4 rounded-xl font-bold"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
