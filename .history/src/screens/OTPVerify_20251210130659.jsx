import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function OTPVerify({ setScreen }) {
  const [inputOtp, setInputOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  const pending = JSON.parse(localStorage.getItem("pendingRegistration"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!pending) {
    return <div>Error: No registration data found.</div>;
  }

  const verifyOtp = () => {
    if (inputOtp !== pending.otp) {
      alert("Incorrect OTP. Please try again.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
      name: pending.name,
      mobile: pending.mobile,
      email: pending.email,
      userId: pending.userId,
      password: pending.password,
      kycStatus: "Not Started",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.removeItem("pendingRegistration");

    alert("Registration successful!");
    setScreen("login");
  };

  const resendOtp = () => {
    if (timeLeft > 0) return;

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    alert("New OTP: " + newOtp);

    const updated = { ...pending, otp: newOtp };
    localStorage.setItem("pendingRegistration", JSON.stringify(updated));

    setTimeLeft(60);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <button
        className="flex items-center text-gray-600 mb-4"
        onClick={() => setScreen("register")}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-2xl font-bold text-center mb-4">OTP Verification</h1>
      <p className="text-center text-gray-600 mb-6">
        Enter the 6-digit OTP sent to {pending.mobile}
      </p>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">

        <input
          maxLength={6}
          value={inputOtp}
          onChange={(e) => setInputOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border p-3 rounded text-center text-lg tracking-widest"
        />

        <button
          onClick={verifyOtp}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          Verify OTP
        </button>

        <button
          onClick={resendOtp}
          disabled={timeLeft > 0}
          className={`w-full border p-3 rounded-lg ${
            timeLeft > 0 ? "opacity-50" : ""
          }`}
        >
          Resend OTP {timeLeft > 0 ? `in ${timeLeft}s` : ""}
        </button>
      </div>
    </div>
  );
}
