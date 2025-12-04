import { useState, useEffect } from "react";
import { Shield, User, Briefcase, Volume2, VolumeX, LogOut, 
         FileText, ChevronRight, WifiOff, Clock, CheckCircle, 
         X, Upload, Camera, Check } from "lucide-react";
import LOCALIZATION from "./data/localization"; 
import CameraView from "./components/CameraView";
export default function App() {
  // App State
  const [currentScreen, setCurrentScreen] = useState('splash'); // splash, login, dashboard, kyc_flow, admin
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'
  const [lang, setLang] = useState('en');
  
  // KYC Workflow State
  const [kycStatus, setKycStatus] = useState('none'); // none, submitted, approved, rejected
  const [kycStep, setKycStep] = useState(1); // 1: Personal, 2: Docs, 3: Selfie, 4: Review
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    idType: 'aadhaar',
    idNumber: '',
    docFront: null,
    docBack: null,
    selfie: null
  });

  // Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // --- VOICE ENGINE ---
  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- EFFECTS ---
  
  // 1. Load data from LocalStorage (Simulating Offline Persistence)
  useEffect(() => {
    const savedStatus = localStorage.getItem('kyc_status');
    const savedForm = localStorage.getItem('kyc_formData');
    const savedLang = localStorage.getItem('kyc_lang');

    if (savedStatus) setKycStatus(savedStatus);
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedLang) setLang(savedLang);

    setTimeout(() => {
      setCurrentScreen('login');
    }, 2500);
  }, []);

  // 2. Voice Triggers & Persistence
  useEffect(() => {
    const t = LOCALIZATION[lang];
    if (currentScreen === 'dashboard' && kycStatus === 'none') speak(t.voice_intro);
    if (currentScreen === 'kyc_flow') {
       if (kycStep === 1) speak(t.voice_step1);
       if (kycStep === 2) speak(t.voice_step2);
       if (kycStep === 3) speak(t.voice_step3);
    }
  }, [currentScreen, kycStep, lang]);

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem('kyc_status', kycStatus);
    localStorage.setItem('kyc_formData', JSON.stringify(formData));
    localStorage.setItem('kyc_lang', lang);
  }, [kycStatus, formData, lang]);

  // --- HANDLERS ---

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentScreen(role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleFileUpload = (field, files) => {
    // Handle single file or multiple files
    const fileArray = Array.isArray(files) ? files : [files];
    
    // Simulate file processing (reading file names and creating metadata)
    const fileMetadata = fileArray.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString()
    }));
    
    // Simulate file upload with progress
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        [field]: {
          status: 'uploaded',
          files: fileMetadata,
          fileCount: fileArray.length,
          uploadedAt: new Date().toISOString()
        }
      }));
      speak(lang === 'hi' ? "फाइल अपलोड हो गई।" : "File uploaded.");
    }, 1000);
  };

  const submitKYC = () => {
    setKycStatus('submitted');
    setCurrentScreen('dashboard');
    speak(LOCALIZATION[lang].voice_success);
  };

  const adminAction = (action) => {
    setKycStatus(action); // 'approved' or 'rejected'
    alert(action === 'approved' ? 'Approved' : 'Rejected');
  };

  const changeLang = (l) => {
    setLang(l);
    speak(l === 'hi' ? "हिंदी भाषा चुनी गई" : "Language set to English");
  };

  const t = LOCALIZATION[lang];

  // --- RENDER HELPERS ---

  if (currentScreen === 'splash') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-900 text-white">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-bounce">
           <Shield size={48} className="text-indigo-900" />
        </div>
        <h1 className="text-3xl font-bold tracking-widest uppercase">TrustCheck</h1>
        <p className="text-indigo-300 text-sm mt-2">Secure Identity Verification</p>
      </div>
    );
  }

  // --- MAIN UI SHELL ---
  return (
    <div className="flex justify-center bg-gray-200 h-screen font-sans overflow-hidden select-none">
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Floating Voice Toggle */}
        <button 
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full ${isSpeaking ? 'bg-orange-500 animate-pulse' : 'bg-gray-100'} shadow-sm`}
        >
          {voiceEnabled ? <Volume2 size={20} className={isSpeaking ? 'text-white' : 'text-gray-600'}/> : <VolumeX size={20} className="text-gray-400"/>}
        </button>

        {/* --- LOGIN SCREEN --- */}
        {currentScreen === 'login' && (
          <div className="p-8 flex flex-col h-full justify-center bg-indigo-50">
             <div className="mb-8 text-center">
               <Shield size={64} className="text-indigo-600 mx-auto mb-4" />
               <h2 className="text-2xl font-bold text-gray-800">{t.app_name}</h2>
               <p className="text-gray-500">{t.voice_intro}</p>
             </div>

             <div className="space-y-4">
               <button onClick={() => handleLogin('user')} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                 <User size={20} /> {t.login_user}
               </button>
               <button onClick={() => handleLogin('admin')} className="w-full bg-white text-indigo-600 border-2 border-indigo-100 py-4 rounded-xl font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                 <Briefcase size={20} /> {t.login_admin}
               </button>
             </div>
             
             <div className="mt-8 flex justify-center gap-4">
               <button onClick={() => changeLang('en')} className={`px-4 py-2 rounded-full text-xs font-bold ${lang==='en' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'}`}>English</button>
               <button onClick={() => changeLang('hi')} className={`px-4 py-2 rounded-full text-xs font-bold ${lang==='hi' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'}`}>हिंदी</button>
             </div>
          </div>
        )}

        {/* --- USER DASHBOARD --- */}
        {currentScreen === 'dashboard' && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-indigo-900 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative z-10">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center border border-indigo-500">
                     <User size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold">{formData.name || "Aditya Kumar"}</h3>
                     <p className="text-xs text-indigo-300">ID: 8839202</p>
                   </div>
                 </div>
                 <button onClick={() => setCurrentScreen('login')}><LogOut size={20} /></button>
              </div>
              
              <div className="text-center">
                 <p className="text-indigo-300 text-sm mb-1">{t.status_label}</p>
                 <div className="flex items-center justify-center gap-2">
                    {kycStatus === 'none' && <span className="text-2xl font-bold text-gray-400">{t.not_verified}</span>}
                    {kycStatus === 'submitted' && <span className="text-2xl font-bold text-yellow-400">{t.kyc_pending}</span>}
                    {kycStatus === 'approved' && <span className="text-2xl font-bold text-green-400">{t.approved}</span>}
                    {kycStatus === 'rejected' && <span className="text-2xl font-bold text-red-400">{t.rejected}</span>}
                 </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-gray-50 -mt-8 pt-12 px-6 overflow-y-auto">
              
              {/* Offline Indicator */}
              <div className="flex justify-center mb-4">
                 <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] text-gray-600 font-bold">
                    <WifiOff size={12} /> {t.offline_mode}
                 </div>
              </div>

              {kycStatus === 'none' && (
                <div className="bg-white p-6 rounded-2xl shadow-md text-center border border-indigo-50">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <FileText size={32} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{t.app_name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{t.voice_intro}</p>
                  <button 
                    onClick={() => setCurrentScreen('kyc_flow')}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {t.start_kyc} <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {kycStatus === 'submitted' && (
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-400">
                   <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><Clock size={24} /></div>
                      <div>
                        <h3 className="font-bold text-gray-800">{t.under_review}</h3>
                        <p className="text-gray-500 text-sm mt-1">{t.review_desc}</p>
                      </div>
                   </div>
                </div>
              )}

              {kycStatus === 'approved' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center gap-4">
                    <CheckCircle className="text-green-600" size={32} />
                    <div>
                      <h3 className="font-bold text-green-800">{t.approved}</h3>
                      <p className="text-green-600 text-xs">{t.verified_msg}</p>
                    </div>
                  </div>
                  
                  {/* Mock Banking Features */}
                  <div className="grid grid-cols-2 gap-4">
                    {['Transfer', 'Statements', 'Cards', 'Loans'].map((item, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 aspect-square">
                        <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                        <span className="font-bold text-gray-600 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {kycStatus === 'rejected' && (
                 <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600"><X size={24} /></div>
                    <h3 className="font-bold text-red-800">{t.rejected}</h3>
                    <p className="text-red-600 text-sm mb-4">{t.rejected_msg}</p>
                    <button 
                      onClick={() => { setKycStatus('none'); setKycStep(1); }}
                      className="text-red-700 font-bold text-sm underline"
                    >
                      {t.retry}
                    </button>
                 </div>
              )}

            </div>
          </div>
        )}

        {/* --- KYC FLOW WIZARD --- */}
        {currentScreen === 'kyc_flow' && (
          <div className="flex flex-col h-full bg-gray-50">
             {/* Header */}
             <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
                <button onClick={() => setCurrentScreen('dashboard')}><X size={24} className="text-gray-500"/></button>
                <div className="flex-1">
                   <div className="h-2 bg-gray-200 rounded-full w-full">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${(kycStep / 4) * 100}%` }}
                      ></div>
                   </div>
                </div>
                <span className="text-xs font-bold text-gray-500">{t.step_count} {kycStep}/4</span>
             </div>

             {/* Steps Content */}
             <div className="flex-1 p-6 overflow-y-auto">
               
               {/* STEP 1: PERSONAL DETAILS */}
               {kycStep === 1 && (
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

               <input
  type="file"
  id="frontInput"
  style={{ display: 'none' }}
  accept="image/*,application/pdf"
  multiple
  onChange={(e) => handleFileUpload("docFront", Array.from(e.target.files))}
 />

<input
  type="file"
  id="backInput"
  style={{ display: 'none' }}
  accept="image/*,application/pdf"
  multiple
  onChange={(e) => handleFileUpload("docBack", Array.from(e.target.files))}
 />


               {/* STEP 2: DOCUMENT UPLOAD */}
               {kycStep === 2 && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                   <h2 className="text-xl font-bold text-gray-800">{t.step_2}</h2>
                   
                   {/* Front Side */}
                   <div 
                     onClick={() => document.getElementById("frontInput").click()}
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
                     onClick={() => handleFileUpload('docBack')}
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
               {kycStep === 3 && (
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
               {kycStep === 4 && (
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
               {kycStep < 4 ? (
                 <button 
                   onClick={() => setKycStep(kycStep + 1)}
                   className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                 >
                   {t.next} <ChevronRight size={18} />
                 </button>
               ) : (
                 <button 
                   onClick={submitKYC}
                   className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                 >
                   {t.submit_btn} <Check size={18} />
                 </button>
               )}
             </div>
          </div>
        )}

        {/* --- ADMIN PANEL --- */}
        {currentScreen === 'admin' && (
          <div className="flex flex-col h-full bg-gray-100">
             <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
                <h2 className="font-bold text-lg flex items-center gap-2"><Briefcase size={20} /> {t.admin_panel}</h2>
                <button onClick={() => setCurrentScreen('login')} className="bg-gray-700 p-2 rounded-lg text-xs hover:bg-gray-600">{t.admin_logout}</button>
             </div>

             <div className="p-4 flex-1 overflow-y-auto">
                <h3 className="text-gray-600 font-bold mb-4 uppercase text-xs tracking-wider">{t.pending_req}</h3>
                
                {kycStatus === 'submitted' ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                        <div>
                           <h4 className="font-bold text-gray-800">{formData.name || "Aditya Kumar"}</h4>
                           <p className="text-xs text-gray-500">{t.submitted_just_now}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold">PENDING</span>
                     </div>
                     <div className="p-4 grid grid-cols-2 gap-2">
                        <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400">ID Front</div>
                        <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400">ID Back</div>
                        <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400 col-span-2">Selfie</div>
                     </div>
                     <div className="p-4 bg-gray-50 flex gap-3">
                        <button onClick={() => adminAction('rejected')} className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold shadow-sm hover:bg-red-50">{t.reject}</button>
                        <button onClick={() => adminAction('approved')} className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold shadow-sm hover:bg-green-700">{t.approve}</button>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400">
                     <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
                     <p>{t.no_pending}</p>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}