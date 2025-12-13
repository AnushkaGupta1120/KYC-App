import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function Step4Review({ formData, t }) {
  const { name, dob, idType, idNumber, docFront, docBack, selfie } = formData;

  // ✅ Robust status detection
  const isFrontUploaded =
  docFront?.status === "uploaded" ||
  (docFront?.files && docFront.files.length > 0);

const isBackUploaded =
  docBack?.status === "uploaded" ||
  (docBack?.files && docBack.files.length > 0);

const isSelfieCaptured =
  !!(
    selfie &&
    (selfie.status === "captured" ||
     selfie.preview ||
     selfie.data)
  );

const displayName =
  name ? name.charAt(0).toUpperCase() + name.slice(1) : "—";


  const renderStatus = (ok, okText, failText) =>
    ok ? (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle size={18} /> {okText}
      </div>
    ) : (
      <div className="flex items-center gap-1 text-red-500">
        <XCircle size={18} /> {failText}
      </div>
    );

  return (
    <div className="space-y-6">

      {/* USER DETAILS */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="font-bold text-lg mb-4">
          {t?.review_title || "Review Your Information"}
        </h3>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-500">Name</span>
          <span className="font-semibold">{name || "—"}</span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-500">Date of Birth</span>
          <span className="font-semibold">{dob || "—"}</span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-500">ID Type</span>
          <span className="font-semibold">
            {idType === "aadhaar" ? "Aadhaar Card" : idType}
          </span>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-gray-500">ID Number</span>
          <span className="font-semibold">{idNumber || "—"}</span>
        </div>
      </div>

      {/* DOCUMENT STATUS */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="font-bold text-lg mb-4">
          {t?.document_status || "Document Status"}
        </h3>

        <div className="flex justify-between py-2">
          <span className="text-gray-500">Front Document</span>
          {renderStatus(isFrontUploaded, "Uploaded", "Missing")}
        </div>

        <div className="flex justify-between py-2">
          <span className="text-gray-500">Back Document</span>
          {renderStatus(isBackUploaded, "Uploaded", "Missing")}
        </div>

        <div className="flex justify-between py-2">
          <span className="text-gray-500">Selfie</span>
          {renderStatus(isSelfieCaptured, "Captured", "Missing")}
        </div>
      </div>
    </div>
  );
}
