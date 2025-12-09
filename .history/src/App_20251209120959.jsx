import { useState, useEffect } from "react";
import {
  Shield,
  User,
  Briefcase,
  Volume2,
  VolumeX,
  LogOut,
  FileText,
  ChevronRight,
  WifiOff,
  Clock,
  CheckCircle,
  X,
  Upload,
  Camera,
  Check,
} from "lucide-react";

import LOCALIZATION from "./data/localization";
import CameraView from "./components/CameraView";
import KYCFlow from "./screens/KYCFlow";

export default function App() {
  // SCREEN STATE
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userRole, setUserRole] = useState("user");
  const [lang, setLang] = useState("en");

  // KYC FLOW STATE
  const [kycStatus, setKycStatus] = useState("none"); // none, submitted, approved, rejected
  const [kycStep, setKycStep] = useState(1);

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    idType: "aadhaar",
    idNumber: "",
    docFront: null,
    docBack: null,
    selfie: null,
  });

  // SPEECH
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utter.rate = 0.9;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const t = LOCALIZATION[lang];

  // -------------------------------------
  // LOAD PERSISTED DATA
  // -------------------------------------
  useEffect(() => {
    const savedStatus = localStorage.getItem("kyc_status");
    const savedForm = localStorage.getItem("kyc_formData");
    const savedLang = localStorage.getItem("kyc_lang");

    if (savedStatus) setKycStatus(savedStatus);
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedLang) setLang(savedLang);

    setTimeout(() => {
      setCurrentScreen("login");
    }, 2000);
  }, []);

  // PERSIST STATE
  useEffect(() => {
    localStorage.setItem("kyc_status", kycStatus);
    localStorage.setItem("kyc_formData", JSON.stringify(formData));
    localStorage.setItem("kyc_lang", lang);
  }, [kycStatus, formData, lang]);

  // -------------------------------------
  // EVENT HANDLERS
  // -------------------------------------

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentScreen(role === "admin" ? "admin" : "dashboard");
  };

  // FIXED FILE UPLOAD HANDLER (with preview base64)
  const handleFileUpload = (field, files) => {
    const fileArr = Array.isArray(files) ? files : [files];

    const toBase64 = (file) =>
      new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(file);
      });

    Promise.all(
      fileArr.map(async (file) => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
        preview: await toBase64(file),
      }))
    ).then((meta) => {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          status: "uploaded",
          files: meta,
          fileCount: meta.length,
          uploadedAt: new Date().toISOString(),
        },
      }));
      speak(lang === "hi" ? "फाइल अपलोड हो गई।" : "File uploaded.");
    });
  };

  const submitKYC = () => {
    setKycStatus("submitted");
    setCurrentScreen("dashboard");
    speak(t.voice_success);
  };

  const adminAction = (action) => {
    setKycStatus(action);
    alert(action === "approved" ? t.approve : t.reject);
  };

  const changeLang = (l) => {
    setLang(l);
    speak(l === "hi" ? "हिन्दी चुनी गई।" : "Language set to English");
  };

  // -------------------------------------
  // SCREENS
  // -------------------------------------

  if (currentScreen === "splash") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-900 text-white">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
          <Shield size={48} className="text-indigo-900" />
        </div>
        <h1 className="text-3xl font-bold">TrustCheck</h1>
        <p className="text-indigo-300 text-sm mt-2">Secure Identity Verification</p>
      </div>
    );
  }

  // -------------------------------------
  // MAIN UI SHELL FOR ALL OTHER SCREENS
  // -------------------------------------

  return (
    <div className="flex justify-center bg-gray-200 h-screen font-sans select-none">
      <div className="w-full max-w-md h-full bg-white shadow-2xl relative flex flex-col overflow-hidden">

        {/* LOGIN SCREEN */}
        {currentScreen === "login" && (
          <div className="p-8 flex flex-col h-full justify-center bg-indigo-50">
            <div className="mb-8 text-center">
              <Shield size={64} className="text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">{t.app_name}</h2>
              <p className="text-gray-500">{t.voice_intro}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleLogin("user")}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <User size={20} /> {t.login_user}
              </button>

              <button
                onClick={() => handleLogin("admin")}
                className="w-full bg-white text-indigo-600 border border-indigo-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Briefcase size={20} /> {t.login_admin}
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => changeLang("en")}
                className={`px-4 py-2 rounded-full text-xs font-bold ${
                  lang === "en" ? "bg-indigo-600 text-white" : "bg-white text-gray-500"
                }`}
              >
                English
              </button>

              <button
                onClick={() => changeLang("hi")}
                className={`px-4 py-2 rounded-full text-xs font-bold ${
                  lang === "hi" ? "bg-indigo-600 text-white" : "bg-white text-gray-500"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {currentScreen === "dashboard" && (
          <div className="flex flex-col h-full relative">

            {/* Header */}
            <div className="bg-indigo-900 text-white p-6 pb-10 rounded-b-[2.5rem] shadow-lg">
              <div className="flex justify-between items-center mb-6">

                {/* USER INFO */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center border border-indigo-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{formData.name || "User"}</h3>
                    <p className="text-xs text-indigo-300">ID: 8839202</p>
                  </div>
                </div>

                {/* VOICE + LOGOUT */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`p-2 rounded-full ${
                      voiceEnabled ? "bg-indigo-700 text-white" : "bg-indigo-800 text-indigo-400"
                    }`}
                  >
                    {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>

                  <button onClick={() => setCurrentScreen("login")}>
                    <LogOut size={20} />
                  </button>
                </div>

              </div>

              {/* KYC STATUS */}
              <div className="text-center">
                <p className="text-indigo-300 text-sm">{t.status_label}</p>

                {kycStatus === "none" && <h1 className="text-gray-400 text-xl">{t.not_verified}</h1>}
                {kycStatus === "submitted" && <h1 className="text-yellow-400 text-xl">{t.kyc_pending}</h1>}
                {kycStatus === "approved" && <h1 className="text-green-400 text-xl">{t.approved}</h1>}
                {kycStatus === "rejected" && <h1 className="text-red-400 text-xl">{t.rejected}</h1>}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-gray-50 -mt-8 pt-12 px-6 overflow-y-auto">

              {/* Offline Banner */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] text-gray-600 font-bold">
                  <WifiOff size={12} /> {t.offline_mode}
                </div>
              </div>

              {/* NOT VERIFIED */}
              {kycStatus === "none" && (
                <div className="bg-white p-6 rounded-2xl shadow border border-indigo-50 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
                    <FileText size={32} />
                  </div>
                  <h3 className="font-bold text-lg">{t.app_name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{t.voice_intro}</p>

                  <button
                    onClick={() => setCurrentScreen("kyc_flow")}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow"
                  >
                    {t.start_kyc} <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* SUBMITTED */}
              {kycStatus === "submitted" && (
                <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-yellow-400 flex gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">{t.under_review}</h3>
                    <p className="text-gray-500 text-sm">{t.review_desc}</p>
                  </div>
                </div>
              )}

              {/* APPROVED */}
              {kycStatus === "approved" && (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center gap-4">
                  <CheckCircle size={32} className="text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">{t.approved}</h3>
                    <p className="text-green-600 text-xs">{t.verified_msg}</p>
                  </div>
                </div>
              )}

              {/* REJECTED */}
              {kycStatus === "rejected" && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-3">
                    <X size={24} />
                  </div>
                  <h3 className="font-bold text-red-800">{t.rejected}</h3>
                  <p className="text-red-600 text-sm">{t.rejected_msg}</p>

                  <button
                    onClick={() => {
                      setKycStatus("none");
                      setKycStep(1);
                    }}
                    className="text-red-700 font-bold underline text-sm"
                  >
                    {t.retry}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* KYC FLOW WIZARD */}
        {currentScreen === "kyc_flow" && (
          <KYCFlow
            t={t}
            kycStep={kycStep}
            setKycStep={setKycStep}
            formData={formData}
            setFormData={setFormData}
            handleFileUpload={handleFileUpload}
            submitKYC={submitKYC}
          />
        )}

        {/* ADMIN PANEL */}
        {currentScreen === "admin" && (
          <div className="flex flex-col h-full bg-gray-100">
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow">
              <h2 className="font-bold flex items-center gap-2">
                <Briefcase size={18} /> {t.admin_panel}
              </h2>

              <button
                onClick={() => setCurrentScreen("login")}
                className="bg-gray-700 px-3 py-1 rounded-lg text-xs"
              >
                {t.admin_logout}
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-gray-600 font-bold mb-4 uppercase text-xs tracking-widest">
                {t.pending_req}
              </h3>

              {/* IF SUBMITTED */}
              {kycStatus === "submitted" ? (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

                  <div className="p-4 border-b flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{formData.name || "User"}</h4>
                      <p className="text-xs text-gray-500">{t.submitted_just_now}</p>
                    </div>

                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold">
                      PENDING
                    </span>
                  </div>

                  {/* PREVIEW BLOCK */}
                  <div className="p-4 grid grid-cols-2 gap-2">

                    {/* ID FRONT */}
                    <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                      {formData.docFront?.files?.[0]?.preview ? (
                        <img
                          src={formData.docFront.files[0].preview}
                          className="w-full h-full object-cover"
                          alt="Front"
                        />
                      ) : (
                        "ID Front"
                      )}
                    </div>

                    {/* ID BACK */}
                    <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                      {formData.docBack?.files?.[0]?.preview ? (
                        <img
                          src={formData.docBack.files[0].preview}
                          className="w-full h-full object-cover"
                          alt="Back"
                        />
                      ) : (
                        "ID Back"
                      )}
                    </div>

                    {/* SELFIE */}
                    <div className="col-span-2 bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                      {formData.selfie ? (
                        <img
                          src={formData.selfie}
                          className="w-full h-full object-cover"
                          alt="Selfie"
                        />
                      ) : (
                        "Selfie"
                      )}
                    </div>

                  </div>

                  {/* ADMIN ACTIONS */}
                  <div className="p-4 bg-gray-50 flex gap-3">
                    <button
                      onClick={() => adminAction("rejected")}
                      className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold"
                    >
                      {t.reject}
                    </button>

                    <button
                      onClick={() => adminAction("approved")}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold"
                    >
                      {t.approve}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-20">
                  <CheckCircle size={48} className="opacity-20 mx-auto mb-4" />
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
