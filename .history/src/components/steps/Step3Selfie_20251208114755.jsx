import { User, Camera, Check } from "lucide-react";
import CameraView from "../CameraView";

export default function Step3Selfie({ formData, setFormData, t }) {

  if (formData.selfie === "active") {
    return (
      <CameraView
        instruction={t.camera_instr}
        onClose={() => setFormData({ ...formData, selfie: null })}
        onCapture={() => setFormData({ ...formData, selfie: "captured" })}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">{t.step_3}</h2>

      {!formData.selfie ? (
        <div className="aspect-[3/4] bg-gray-200 rounded-2xl flex flex-col items-center justify-center">
          <User size={80} className="text-gray-400 mb-4" />
          <p className="text-gray-500 text-sm mb-6 text-center px-6">{t.camera_instr}</p>

          <button
            onClick={() => setFormData({ ...formData, selfie: "active" })}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2"
          >
            <Camera size={20} /> {t.take_selfie}
          </button>
        </div>
      ) : (
        <div className="aspect-[3/4] bg-gray-800 rounded-2xl flex items-center justify-center relative">
          <div className="absolute bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <Check size={18} /> {t.captured}
          </div>
        </div>
      )}
    </div>
  );
}
