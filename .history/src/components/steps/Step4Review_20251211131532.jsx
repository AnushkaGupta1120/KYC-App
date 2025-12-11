import React from "react";
import { CheckCircle } from "lucide-react";

export default function Step4Review({ formData, t }) {
  const {
    name,
    dob,
    idType,
    idNumber,
    docFront,
    docBack,
    selfie,
  } = formData;

  return (
    <div className="space-y-6">

      {/* USER DETAILS CARD */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="font-bold text-lg mb-4">{t.review_title || "Review your details"}</h3>

        <div className="flex justify-between border-b py-2">
          <span className="text-gray-500">Name</span>
          <span className="font-semibold">{name || "Not provided"}</span>
        </div>

        <div className="flex justify-between border-b py-2">
          <span className="text-gray-500">Date of Birth</span>
          <span className="font-semibold">{dob || "Not provided"}</span>
        </div>

        <div className="flex justify-between border-b py-2">
          <span className="text-gray-500">ID Type</span>
          <span className="font-semibold">{idType === "aadhaar" ? "Aadhaar Card" : idType}</span>
        </div>

        <div className="flex justify-between border-b py-2">
          <span className="text-gray-500">ID Number</span>
          <span className="font-semibold">{idNumber || "Not provided"}</span>
        </div>
      </div>

      {/* DOCUMENT STATUS */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="font-bold text-lg mb-4">{t.document_status || "Document Status"}</h3>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Front Document</span>
          {docFront?.status === "uploaded" ? (
            <CheckCircle className="text-green-600" size={20} />
          ) : (
            <span className="text-red-500">Not uploaded</span>
          )}
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Back Document</span>
          {docBack?.status === "uploaded" ? (
            <CheckCircle className="text-green-600" size={20} />
          ) : (
            <span className="text-red-500">Not uploaded</span>
          )}
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Selfie</span>
          {selfie?.status === "captured" ? (
            <CheckCircle className="text-green-600" size={20} />
          ) : (
            <span className="text-red-500">Not captured</span>
          )}
        </div>
      </div>
    </div>
  );
}
