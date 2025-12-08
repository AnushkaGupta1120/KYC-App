import React, { useRef, useState } from 'react';
import { X, CheckCircle, Upload, User, Camera, Check, ChevronRight, Shield } from 'lucide-react';
import CameraView from '../components/CameraView';

const KYCFlow = ({ t, step, setStep, formData, setFormData, submit, onBack, onFileUpload }) => {

  const [frontFileInfo, setFrontFileInfo] = useState(null);
  const [backFileInfo, setBackFileInfo] = useState(null);

  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);

  const generatePreviewObjects = (fileArray) => {
    return fileArray.map(file => {
      if (file.type === "application/pdf") {
        return {
          type: "pdf",
          url: null,
          name: file.name,
        };
      }
      return {
        type: "image",
        url: URL.createObjectURL(file),
        name: file.name,
      };
    });
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const previews = generatePreviewObjects(files);

    if (field === "docFront") {
      setFrontFileInfo({ previews, count: files.length });
      setFormData(prev => ({ ...prev, docFront: files }));
    } else {
      setBackFileInfo({ previews, count: files.length });
      setFormData(prev => ({ ...prev, docBack: files }));
    }

    onFileUpload(field, files);
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const previews = generatePreviewObjects(files);

    if (field === "docFront") {
      setFrontFileInfo({ previews, count: files.length });
      setFormData(prev => ({ ...prev, docFront: files }));
    } else {
      setBackFileInfo({ previews, count: files.length });
      setFormData(prev => ({ ...prev, docBack: files }));
    }

    onFileUpload(field, files);
  };

  const handleDragOver = (e) => e.preventDefault();


  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* HEADER */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack}><X size={24} className="text-gray-500" /></button>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full w-full">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-500">{t.step_count} {step}/4</span>
      </div>


      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* ------------------ STEP 2 (DOCUMENT UPLOAD) ------------------ */}
       {/* STEP 2: DOCUMENT UPLOAD */}
{step === 2 && (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

    {/* Hidden Inputs */}
    <input
      type="file"
      id="frontInput"
      style={{ display: 'none' }}
      accept="image/*,application/pdf"
      multiple
      onChange={(e) => handleFileChange(e, "docFront")}
    />

    <input
      type="file"
      id="backInput"
      style={{ display: 'none' }}
      accept="image/*,application/pdf"
      multiple
      onChange={(e) => handleFileChange(e, "docBack")}
    />

    {/* FRONT SIDE */}
    <div
      onClick={() => document.getElementById("frontInput").click()}
      onDrop={(e) => handleDrop(e, "docFront")}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors 
      ${frontFileInfo ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-indigo-400'}`}
    >
      {frontFileInfo ? (
        <>
          <CheckCircle className="text-green-600" size={32} />
          <span className="text-sm font-bold text-green-700">Uploaded Successfully</span>
        </>
      ) : (
        <>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <Upload size={20} />
          </div>
          <span className="text-sm font-bold text-gray-600">Upload Front Side</span>
          <span className="text-xs text-gray-400">Supports JPG, PNG, PDF</span>
        </>
      )}
    </div>

    {/* BACK SIDE */}
    <div
      onClick={() => document.getElementById("backInput").click()}
      onDrop={(e) => handleDrop(e, "docBack")}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors 
      ${backFileInfo ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-indigo-400'}`}
    >
      {backFileInfo ? (
        <>
          <CheckCircle className="text-green-600" size={32} />
          <span className="text-sm font-bold text-green-700">Uploaded Successfully</span>
        </>
      ) : (
        <>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <Upload size={20} />
          </div>
          <span className="text-sm font-bold text-gray-600">Upload Back Side</span>
          <span className="text-xs text-gray-400">Supports JPG, PNG, PDF</span>
        </>
      )}
    </div>

  </div>
)}

      </div>


      {/* FOOTER */}
      <div className="p-4 bg-white border-t border-gray-100">
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {t.next} <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={submit}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {t.submit_btn} <Check size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default KYCFlow;
