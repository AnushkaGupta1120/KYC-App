import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function RegisterUser({ setScreen }) {
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

  const registerUser = () => {
    if (
      !form.name ||
      !form.mobile ||
      !form.email ||
      !form.password ||
      !form.userId
    ) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check duplicate userId
    if (users.some((u) => u.userId === form.userId)) {
      alert("User ID already exists. Choose another.");
      return;
    }

    const newUser = {
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      userId: form.userId,
      password: form.password,
      kycStatus: "Not Started",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please login now.");
    setScreen("login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <button
        className="flex items-center text-gray-600 mb-4"
        onClick={() => setScreen("login")}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-2xl font-bold text-center mb-6">
        Register New User
      </h1>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="userId"
          placeholder="Create User ID"
          value={form.userId}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          onClick={registerUser}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          Register
        </button>
      </div>
    </div>
  );
}
