export default function Step1Personal({ formData, setFormData, t }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t.step_1}</h2>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">{t.name_label}</label>
        <input
          type="text"
          className="w-full p-4 rounded-xl border border-gray-300 mt-1 bg-white"
          placeholder={t.name_placeholder}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">{t.dob_label}</label>
        <input
          type="date"
          className="w-full p-4 rounded-xl border border-gray-300 mt-1 bg-white"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">{t.id_type_label}</label>
        <select className="w-full p-4 rounded-xl border border-gray-300 mt-1 bg-white">
          <option>Aadhaar Card</option>
          <option>PAN Card</option>
          <option>Passport</option>
          <option>Driving License</option>
        </select>
      </div>
    </div>
  );
}
