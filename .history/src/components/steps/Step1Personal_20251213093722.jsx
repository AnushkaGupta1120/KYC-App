import React, { useEffect, useMemo } from "react";

const isAbove18 = (dob) => {
  if (!dob) return false;
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

const generateIdNumber = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export default function Step1Personal({ formData, setFormData, onNext, t }) {
  const isAdult = useMemo(() => isAbove18(formData.dob), [formData.dob]);

  // Auto-generate ID number ONCE
  useEffect(() => {
    if (!formData.idNumber) {
      setFormData((prev) => ({
        ...prev,
        idNumber: generateIdNumber(),
      }));
    }
  }, [formData.idNumber, setFormData]);

  const canProceed =
    formData.name?.trim() &&
    formData.dob &&
    isAdult &&
    formData.idType &&
    formData.idNumber;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-bold text-lg mb-4">
          {t.personal_title || "Personal Details"}
        </h3>

        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* DOB */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dob: e.target.value }))
            }
            className="w-full border p-3 rounded-xl"
          />
          {formData.dob && !isAdult && (
            <p className="text-red-500 text-xs">
              You must be at least 18 years old
            </p>
          )}
        </div>

        {/* ID TYPE */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">ID Type</label>
          <select
            value={formData.idType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, idType: e.target.value }))
            }
            className="w-full border p-3 rounded-xl"
          >
            <option value="aadhaar">Aadhaar Card</option>
            <option value="pan">PAN Card</option>
          </select>
        </div>

        {/* AUTO ID NUMBER */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">ID Number</label>
          <input
            type="text"
            value={formData.idNumber}
            disabled
            className="w-full border p-3 rounded-xl bg-gray-100 text-gray-700"
          />
        </div>
      </div>

      {/* NEXT BUTTON */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-full py-3 rounded-xl font-bold transition ${
          canProceed
            ? "bg-indigo-600 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}
