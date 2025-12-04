import { useState, useEffect } from "react";
import { Shield, User, Briefcase, Volume2, VolumeX, LogOut, 
         FileText, ChevronRight, WifiOff, Clock, CheckCircle, 
         X, Check } from "lucide-react";
import LOCALIZATION from "./data/localization"; 
import KYCFlow from "./KYCFlow";

export default function App() {

  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userRole, setUserRole] = useState('user');
  const [lang, setLang] = useState('en');

  const [kycStatus, setKycStatus] = useState('none');
  const [kycStep, setKycStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    idType: 'aadhaar',
    idNumber: '',
    docFront: null,
    docBack: null,
    selfie: null
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.9;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  // Load saved data from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('kyc_status');
    const savedForm = localStorage.getItem('kyc_formData');
    const savedLang = localStorage.getItem('kyc_lang');

    if (savedStatus) setKycStatus(savedStatus);
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedLang) setLang(savedLang);

    setTimeout(() => setCurrentScreen("login"), 2000);
  }, []);

  // Voice prompts
  useEffect(() => {
    const t = LOCALIZATION[lang];
    if (currentScreen === "dashboard" && kycStatus === "none") speak(t.voice_intro);
    if (currentScreen === "kyc_flow") {
      if (kycStep === 1) speak(t.voice_step1);
      if (kycStep === 2) speak(t.voice_step2);
      if (kycStep === 3) speak(t.voice_step3);
    }
  }, [currentScreen, kycStep, lang]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("kyc_status", kycStatus);
    localStorage.setItem("kyc_formData", JSON.stringify(formData));
    localStorage.setItem("kyc_lang", lang);
  }, [kycStatus, formData, lang]);

  // ---- MAIN FILE UPLOAD HANDLER ----
  const handleFileUpload = (field, files) => {
    if (!files || files.length === 0) return;

    const fileDetails = files.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type
    }));

    setFormData(prev => ({
      ...prev,
      [field]: {
        files: fileDetails,
        raw: files
      }
    }));

    speak(lang === "hi" ? "फाइल अपलोड हो गई" : "File uploaded.");
  };

  const submitKYC = () => {
    setKycStatus("submitted");
    setCurrentScreen("dashboard");
    speak(LOCALIZATION[lang].voice_success);
  };

  const changeLang = (l) => {
    setLang(l);
    speak(l === "hi" ? "हिंदी भाषा चुनी गई" : "Language set to English");
  };

  const t = LOCALIZATION[lang];


  // === SPLASH SCREEN ===
  if (currentScreen === "splash") {
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


  return (
    <div className="flex justify-center bg-gray-200 h-screen font-sans overflow-hidden select-none">
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col overflow-hidden">

        {/* Voice Toggle */}
        <button 
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full 
            ${isSpeaking ? "bg-orange-500 animate-pulse" : "bg-gray-100"} shadow-sm`}
        >
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* LOGIN SCREEN */}
        {currentScreen === "login" && (
          <div className="p-8 flex flex-col h-full justify-center bg-indigo-50">
            <div className="mb-8 text-center">
              <Shield size={64} className="text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">{t.app_name}</h2>
              <p className="text-gray-500">{t.voice_intro}</p>
            </div>

            <button 
              onClick={() => setCurrentScreen("dashboard")}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg mb-4"
            >
              <User size={20} /> {t.login_user}
            </button>

            <button 
              onClick={() => setCurrentScreen("admin")}
              className="w-full bg-white text-indigo-600 border-2 border-indigo-100 py-4 rounded-xl font-bold shadow-sm"
            >
              <Briefcase size={20} /> {t.login_admin}
            </button>

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => changeLang("en")} 
                className={`px-4 py-2 rounded-full text-xs font-bold ${lang === "en" ? "bg-indigo-600 text-white" : "bg-white text-gray-500"}`}>
                English
              </button>
              <button onClick={() => changeLang("hi")} 
                className={`px-4 py-2 rounded-full text-xs font-bold ${lang === "hi" ? "bg-indigo-600 text-white" : "bg-white text-gray-500"}`}>
                हिंदी
              </button>
            </div>
          </div>
        )}

        {/* KYC FLOW */}
        {currentScreen === "kyc_flow" && (
          <KYCFlow 
            t={t}
            step={kycStep}
            setStep={setKycStep}
            formData={formData}
            setFormData={setFormData}
            submit={submitKYC}
            onBack={() => setCurrentScreen("dashboard")}
            onFileUpload={handleFileUpload}
          />
        )}

      </div>
    </div>
  );
}
