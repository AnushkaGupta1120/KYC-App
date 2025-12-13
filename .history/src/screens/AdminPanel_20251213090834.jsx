// src/screens/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, X } from "lucide-react";

export default function AdminPanel({
  t,
  status,
  formData,
  adminAction,
  setCurrentScreen,
  rejectionReason,
}) {
  const [reason, setReason] = useState("");

  const isKYCSubmitted =
    status === "submitted" ||
    status === "approved" ||
    status === "rejected";

  useEffect(() => {
    console.log("AdminPanel updated, status:", status);
  }, [status]);

  return (
    <div className="p-6">
      <button
        onClick={() => setCurrentScreen("login")}
        className="flex items-center text-sm text-indigo-600 mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

      {/* EMPTY STATE */}
      {!isKYCSubmitted && (
        <div className="bg-gray-50 p-6 rounded-xl border border-dashed text-center text-gray-500">
          <p className="font-semibold">No KYC submission yet</p>
          <p className="text-sm mt-1">
            User has not submitted KYC details.
          </p>
        </div>
      )}

      {/* KYC DETAILS */}
      {isKYCSubmitted && (
        <>
          <div className="bg-white p-5 rounded-xl shadow mb-6 border border-gray-200">
            <h2 className="font-semibold mb-3">KYC Information</h2>

            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>ID Type:</strong> {formData.idType}</p>
            <p><strong>ID Number:</strong> {formData.idNumber}</p>
          </div>

          {/* CURRENT STATUS */}
          <div className="bg-blue-50 p-4 mb-6 rounded-xl text-center font-bold">
            Current Status: {status.toUpperCase()}
          </div>

          {/* REJECTION REASON */}
          {status === "rejected" && (
            <div className="bg-red-50 p-4 mb-6 rounded-xl text-red-700">
              <p className="font-semibold">Rejection Reason</p>
              <p className="text-sm">{rejectionReason}</p>
            </div>
          )}

          {/* APPROVE */}
          <button
            onClick={() => adminAction("approved")}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mb-4 flex justify-center items-center gap-2"
          >
            <CheckCircle size={18} /> Approve KYC
          </button>

          {/* REJECT */}
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <textarea
              placeholder="Enter rejection reason..."
              className="w-full p-3 border rounded-xl text-sm mb-3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <button
              onClick={() => {
                if (!reason.trim()) {
                  alert("Please enter a rejection reason");
                  return;
                }
                adminAction("rejected", reason);
                setReason("");
              }}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              <X size={18} /> Reject KYC
            </button>
          </div>
        </>
      )}
    </div>
  );
}
