import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function UserLogin({ setCurrentScreen }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN FUNCTION
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.userId === userId && u.password === password
    );

    if (!user) {
      alert("Invalid User ID or Password");
      return;
    }

    alert("Login Successful");
    setCurrentScreen("dashboard");
  };

  return (
    <div className="p-8 bg-gray-100 h-full">
      {/* BACK BUTTON */}
      <button
        onClick={() => setCurrentScreen("login")}
        className="flex items-center text-gray-600 mb-4"
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          className="w-full p-3 border rounded"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold"
        >
          Login
        </button>

        {/* REGISTER LINK */}
        <button
          onClick={() => setCurrentScreen("register")}
          className="w-full text-indigo-600 font-bold underline text-sm"
        >
          Register New User
        </button>
      </div>
    </div>
  );
}
