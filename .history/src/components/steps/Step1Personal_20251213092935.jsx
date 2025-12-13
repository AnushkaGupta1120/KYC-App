export default function Step1Details({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      {/* NAME */}
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        className="w-full border p-3 rounded-xl"
      />

      {/* DOB */}
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
  );
}
