import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function AdminPanel({ t, status, formData, adminAction, setCurrentScreen }) {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    console.log("AdminPanel updated, status:", status);
  }, [status]);

  const readableStatus = status ? status.toUpperCase() : "NO STATUS";

  return (
    <div className="p-6 relative">

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

        {/* APPROVE */}
        <button
          onClick={() => adminAction("approved")}
          className="w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} /> Approve KYC
        </button>

        {/* REJECT with Reason */}
        <button
          onClick={() => setShowRejectBox(true)}
          className="w-full bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <XCircle size={20} /> Reject KYC
        </button>
      </div>

      {/* REJECT REASON MODAL */}
      {showRejectBox && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white w-11/12 p-6 rounded-xl shadow-xl">

            <h2 className="text-lg font-bold mb-3">Enter Rejection Reason</h2>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-28 outline-none"
              placeholder="Explain why the KYC is rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectBox(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  adminAction("rejected", reason);
                  setShowRejectBox(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Submit Reason
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
