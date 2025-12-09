import { CheckCircle, Shield } from "lucide-react";

export default function Step4Review({ formData, t }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">{t.step_4}</h2>

      <div className="bg-white p-4 rounded-xl shadow border space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">{t.name_label}</span>
          <span className="font-bold">{formData.name || "Not provided"}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">{t.id_type_label}</span>
          <span className="font-bold">Aadhaar Card</span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-500">{t.documents_label}</span>
          <span className="text-green-600 text-xs font-bold flex items-center gap-1">
            <CheckCircle size={12} /> {t.uploaded_status}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t.selfie_label}</span>
          <span className="text-green-600 text-xs font-bold flex items-center gap-1">
            <CheckCircle size={12} /> {t.captured}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
        <Shield size={16} />
        <p>{t.privacy_note}</p>
      </div>
    </div>
  );
}
