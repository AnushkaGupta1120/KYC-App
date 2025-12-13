import { Camera, Check, User } from "lucide-react";
import CameraView from "../CameraView";

export default function Step3Selfie({ t, formData, setFormData }) {

  const startCamera = () => {
    setFormData(prev => ({
      ...prev,
      selfie: { status: "active" }
    }));
  };

  const handleCapture = (base64) => {
    setFormData(prev => ({
      ...prev,
      selfie: {
        status: "captured",
        data: base64,
        capturedAt: new Date().toISOString()
      }
    }));
  };

  const resetSelfie = () => {
    setFormData(prev => ({
      ...prev,
      selfie: null
    }));
  };

  const selfieStatus = formData.selfie?.status;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">{t.step_3}</h2>

      {/* NO SELFIE */}
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

      {/* CAMERA ACTIVE */}
      {selfieStatus === "active" && (
        <CameraView
          onCapture={handleCapture}
          onClose={resetSelfie}
        />
      )}

      {/* SELFIE CAPTURED */}
      {selfieStatus === "captured" && (
        <div className="relative bg-black aspect-[3/4] rounded-2xl overflow-hidden">
          <img
            src={formData.selfie.data}
            alt="Selfie Preview"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
              <Check size={16} /> {t.captured}
            </div>
          </div>

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
