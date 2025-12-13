import React from "react";

export default function Step1Personal({ formData, setFormData, onNext, t }) {
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
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
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
              setFormData((prev) => ({
                ...prev,
                dob: e.target.value,
              }))
            }
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* ID TYPE */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">ID Type</label>
          <select
            value={formData.idType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                idType: e.target.value,
              }))
            }
            className="w-full border p-3 rounded-xl"
          >
            <option value="aadhaar">Aadhaar Card</option>
            <option value="pan">PAN Card</option>
          </select>
        </div>

        {/* ID NUMBER */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">ID Number</label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                idNumber: e.target.value,
              }))
            }
            className="w-full border p-3 rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
      >
        Next
      </button>
    </div>
  );
}
