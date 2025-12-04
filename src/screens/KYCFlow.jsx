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
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-gray-800">{t.step_2}</h2>

            {/* Hidden Inputs */}
            <input
              type="file"
              ref={frontFileRef}
              style={{ display: "none" }}
              accept="image/*,application/pdf"
              multiple
              onChange={(e) => handleFileChange(e, "docFront")}
            />

            <input
              type="file"
              ref={backFileRef}
              style={{ display: "none" }}
              accept="image/*,application/pdf"
              multiple
              onChange={(e) => handleFileChange(e, "docBack")}
            />


            {/* FRONT SIDE UPLOAD */}
            <div
              onClick={() => frontFileRef.current.click()}
              onDrop={(e) => handleDrop(e, "docFront")}
              onDragOver={handleDragOver}
              className={`
                border-2 border-dashed rounded-xl p-8 cursor-pointer select-none transition-colors
                ${frontFileInfo ? "border-green-500 bg-green-50" : "border-gray-300 bg-white hover:border-indigo-400"}
              `}
            >
              {!frontFileInfo ? (
                <div className="pointer-events-none flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Upload size={20} />
                  </div>
                  <span className="text-sm font-bold text-gray-600">{t.upload_front}</span>
                  <span className="text-xs text-gray-400">Supports JPG, PNG, PDF</span>
                </div>
              ) : (
                <div className="pointer-events-none flex flex-col gap-4">
                  {frontFileInfo.previews.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
                      {file.type === "image" ? (
                        <img src={file.url} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold">
                          PDF
                        </div>
                      )}
                      <span className="text-xs text-gray-700 break-all">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* BACK SIDE UPLOAD */}
            <div
              onClick={() => backFileRef.current.click()}
              onDrop={(e) => handleDrop(e, "docBack")}
              onDragOver={handleDragOver}
              className={`
                border-2 border-dashed rounded-xl p-8 cursor-pointer select-none transition-colors
                ${backFileInfo ? "border-green-500 bg-green-50" : "border-gray-300 bg-white hover:border-indigo-400"}
              `}
            >
              {!backFileInfo ? (
                <div className="pointer-events-none flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Upload size={20} />
                  </div>
                  <span className="text-sm font-bold text-gray-600">{t.upload_back}</span>
                  <span className="text-xs text-gray-400">Supports JPG, PNG, PDF</span>
                </div>
              ) : (
                <div className="pointer-events-none flex flex-col gap-4">
                  {backFileInfo.previews.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
                      {file.type === "image" ? (
                        <img src={file.url} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold">
                          PDF
                        </div>
                      )}
                      <span className="text-xs text-gray-700 break-all">{file.name}</span>
                    </div>
                  ))}
                </div>
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
