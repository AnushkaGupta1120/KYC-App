import { Camera, Check, User } from "lucide-react";
import CameraView from "../CameraView";

export default function Step3Selfie({ t, formData, setFormData }) {
  const startCamera = () => {
    setFormData({ ...formData, selfie: "active" });
  };

  const handleCapture = (base64) => {
    setFormData({ ...formData, selfie: base64 });  // STORE PREVIEW
  };

  const resetSelfie = () => {
    setFormData({ ...formData, selfie: null });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">{t.step_3}</h2>

      {/* CASE 1: No selfie yet */}
      {!formData.selfie && (
        <div className="bg-gray-200 aspect-[3/4] rounded-2xl flex flex-col items-center justify-center">
          <User size={80} className="text-gray-400 mb-4" />
          <button
            onClick={startCamera}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow"
          >
            <Camera size={20} /> {t.take_selfie}
          </button>
        </div>
      )}

      {/* CASE 2: Camera is active */}
      {formData.selfie === "active" && (
        <CameraView
          onCapture={handleCapture}
          onClose={resetSelfie}
        />
      )}

      {/* CASE 3: Selfie is captured → SHOW PREVIEW */}
      {formData.selfie && formData.selfie !== "active" && (
        <div className="relative bg-black aspect-[3/4] rounded-2xl overflow-hidden">

          {/* Preview Image */}
          <img
            src={formData.selfie}
            alt="Selfie Preview"
            className="w-full h-full object-cover"
          />

          {/* “Captured” Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
              <Check size={16} /> {t.captured}
            </div>
          </div>

          {/* Retake button */}
          <button
            onClick={resetSelfie}
            className="absolute bottom-4 inset-x-0 mx-auto text-white text-sm underline text-center"
          >
            {t.retake}
          </button>
        </div>
      )}
    </div>
  );
}
