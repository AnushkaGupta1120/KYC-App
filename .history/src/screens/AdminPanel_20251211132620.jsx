import React, { useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function AdminPanel({ t, status, formData, adminAction, setCurrentScreen }) {

  useEffect(() => {
    console.log("AdminPanel updated, status:", status);
  }, [status]);

  const readableStatus = status
    ? status.toUpperCase()
    : "NO STATUS";

  return (
    <div className="p-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => setCurrentScreen("login")}
        className="flex items-center gap-2 mb-4 text-indigo-600"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      {/* USER DETAILS */}
      <div className="bg-white shadow-md rounded-xl p-5 space-y-2 mb-6">
        <h2 className="font-semibold text-gray-700 mb-2">KYC Information</h2>

        <p><strong>Name:</strong> {formData.name || "Not provided"}</p>
        <p><strong>ID Type:</strong> {formData.idType || "Not provided"}</p>
        <p><strong>ID Number:</strong> {formData.idNumber || "Not provided"}</p>
      </div>

      {/* LIVE STATUS DISPLAY */}
      <div className="bg-indigo-50 p-4 rounded-xl mb-6">
        <p className="font-semibold">Current Status: {readableStatus}</p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-4">
        <button
          onClick={() => adminAction("approved")}
          className="w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} /> Approve KYC
        </button>

        <button
          onClick={() => adminAction("rejected")}
          className="w-full bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <XCircle size={20} /> Reject KYC
        </button>
      </div>
    </div>
  );
}
