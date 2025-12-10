import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function RegisterUser({ setCurrentScreen }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!form.name || !form.mobile || !form.email || !form.userId || !form.password) {
      alert("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.userId === form.userId)) {
      alert("User ID already exists.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    localStorage.setItem("pendingRegistration", JSON.stringify({ ...form, otp }));

    alert("OTP sent: " + otp); // Replace with SMS API later

    setCurrentScreen("otp_verify");
  };

  return (
    <div className="p-8 bg-gray-100 h-full">
      <button
        onClick={() => setCurrentScreen("login")}
        className="flex items-center text-gray-600 mb-4"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-6">Register New User</h2>

      <div className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border rounded" />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} className="w-full p-3 border rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded" />
        <input name="userId" placeholder="Create User ID" onChange={handleChange} className="w-full p-3 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-3 border rounded" />

        <button onClick={handleRegister} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold">
          Register
        </button>
      </div>
    </div>
  );
}
