import { Upload, CheckCircle } from "lucide-react";

export default function UploadBox({ uploaded, onClick, label }) {
  return (
    <div
      onClick={onClick}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors 
      ${uploaded ? "border-green-500 bg-green-50" : "border-gray-300 bg-white hover:border-indigo-400"}`}
    >
      {uploaded ? (
        <>
          <CheckCircle className="text-green-600" size={32} />
          <span className="text-sm font-bold text-green-700">Uploaded</span>
        </>
      ) : (
        <>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <Upload size={20} />
          </div>
          <span className="text-sm font-bold text-gray-700">{label}</span>
          <span className="text-xs text-gray-400">Supports JPG, PNG, PDF</span>
        </>
      )}
    </div>
  );
}
