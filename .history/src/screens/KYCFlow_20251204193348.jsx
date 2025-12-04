import React from 'react';
import { X, CheckCircle, Upload, User, Camera, Check, ChevronRight } from 'lucide-react';
import CameraView from '../components/CameraView';

const KYCFlow = ({ t, step, setStep, formData, setFormData, submit, onBack, onFileUpload, isSpeaking }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
       {/* Header */}
       <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
          <button onClick={onBack}><X size={24} className="text-gray-500"/></button>
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

       {/* Steps Content */}
       <div className="flex-1 p-6 overflow-y-auto">
         
         {/* STEP 1: PERSONAL DETAILS */}
         {step === 1 && (
           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-xl font-bold text-gray-800 mb-4">{t.step_1}</h2>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{t.name_label}</label>
               <input 
                 type="text" 
                 className="w-full p-4 rounded-xl border border-gray-300 mt-1 outline-indigo-500 bg-white" 
                 placeholder={t.name_placeholder}
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{t.dob_label}</label>
               <input type="date" className="w-full p-4 rounded-xl border border-gray-300 mt-1 outline-indigo-500 bg-white" />
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{t.id_type_label}</label>
               <select className="w-full p-4 rounded-xl border border-gray-300 mt-1 outline-indigo-500 bg-white">
                  <option>Aadhaar Card</option>
                  <option>PAN Card</option>
                  <option>Passport</option>
                  <option>Driving License</option>
               </select>
             </div>
           </div>
         )}

         {/* STEP 2: DOCUMENT UPLOAD */}
         {step === 2 && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-xl font-bold text-gray-800">{t.step_2}</h2>
             
             {/* Front Side */}
             <div 
               onClick={() => onFileUpload('docFront')}
               className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors ${formData.docFront ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-indigo-400'}`}
             >
                {formData.docFront ? (
                  <>
                    <CheckCircle className="text-green-600" size={32} />
                    <span className="text-sm font-bold text-green-700">{t.front_uploaded}</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><Upload size={20} /></div>
                    <span className="text-sm font-bold text-gray-600">{t.upload_front}</span>
                    <span className="text-xs text-gray-400">{t.file_formats}</span>
                  </>
                )}
             </div>

             {/* Back Side */}
             <div 
               onClick={() => onFileUpload('docBack')}
               className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors ${formData.docBack ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-indigo-400'}`}
             >
                {formData.docBack ? (
                  <>
                    <CheckCircle className="text-green-600" size={32} />
                    <span className="text-sm font-bold text-green-700">{t.back_uploaded}</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><Upload size={20} /></div>
                    <span className="text-sm font-bold text-gray-600">{t.upload_back}</span>
                    <span className="text-xs text-gray-400">{t.file_formats}</span>
                  </>
                )}
             </div>
           </div>
         )}

         {/* STEP 3: SELFIE */}
         {step === 3 && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-gray-800">{t.step_3}</h2>
              
              {!formData.selfie ? (
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                   <User size={80} className="text-gray-400 mb-4" />
                   <p className="text-gray-500 text-sm mb-6 text-center px-8">{t.camera_instr}</p>
                   <button 
                     onClick={() => setFormData({...formData, selfie: 'active'})}
                     className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                   >
                     <Camera size={20} /> {t.take_selfie}
                   </button>
                </div>
              ) : formData.selfie === 'active' ? (
                 <CameraView 
                   instruction={t.camera_instr} 
                   onClose={() => setFormData({...formData, selfie: null})}
                   onCapture={(blob) => setFormData({...formData, selfie: 'captured'})}
                 />
              ) : (
                 <div className="aspect-[3/4] bg-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover opacity-80" alt="Selfie" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                         <Check size={18} /> {t.captured}
                       </div>
                    </div>
                    <button onClick={() => setFormData({...formData, selfie: null})} className="absolute bottom-4 text-white text-sm underline">{t.retake}</button>
                 </div>
              )}
           </div>
         )}

         {/* STEP 4: REVIEW */}
         {step === 4 && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-gray-800">{t.step_4}</h2>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
                 <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 text-sm">{t.name_label}</span>
                    <span className="font-bold text-gray-800">{formData.name || "John Doe"}</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 text-sm">{t.id_type_label}</span>
                    <span className="font-bold text-gray-800">Aadhaar Card</span>
                 </div>
                 <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-500 text-sm">{t.documents_label}</span>
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> {t.uploaded_status}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">{t.selfie_label}</span>
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> {t.captured}</span>
                 </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
                 <Shield size={16} className="mt-0.5 shrink-0" />
                 <p>{t.privacy_note}</p>
              </div>
           </div>
         )}

       </div>

       {/* Footer Navigation */}
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