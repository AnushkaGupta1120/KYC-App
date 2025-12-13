// src/App.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";

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
} from "lucide-react";

import RegisterUser from "./screens/RegisterUser.jsx";
import OTPVerify from "./screens/OTPVerify.jsx";
import UserLogin from "./screens/UserLogin.jsx";
import AdminPanel from "./screens/AdminPanel.jsx";
import KYCFlow from "./screens/KYCFlow.jsx";

import LOCALIZATION from "./data/localization";

// ---------- Optimized useVoice hook ----------
function useVoice(initialLang = "en", initialEnabled = true) {
  const [lang, setLang] = useState(initialLang);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");


  // throttle control
  const THROTTLE_DELAY = 700; // ms
  const lastSpeakRef = useRef(0);

  // Cancel active speech
  const cancelSpeech = useCallback(() => {
    try {
      if (window?.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (err) {
      console.warn("Speech cancel error:", err);
    }
  }, []);

  // Main speak function
  const speak = useCallback(
    (text, opts = {}) => {
      if (!enabled || !text) return;
      if (!window?.speechSynthesis || typeof window.SpeechSynthesisUtterance === "undefined") return;

      const now = Date.now();
      if (now - lastSpeakRef.current < THROTTLE_DELAY) return;
      lastSpeakRef.current = now;

      // Cancel previous speech to avoid overlap
      cancelSpeech();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utter.rate = opts.rate ?? 0.95;
      utter.pitch = opts.pitch ?? 1;

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);

      try {
        window.speechSynthesis.speak(utter);
      } catch (err) {
        console.error("TTS speak error:", err);
      }
    },
    [enabled, lang, cancelSpeech]
  );

  return {
    lang,
    setLang,
    enabled,
    setEnabled,
    isSpeaking,
    speak,
    cancelSpeech,
  };
}

// ---------- App component ----------
export default function App() {
  // ---------- Global state ----------
  const [currentScreen, setCurrentScreen] = useState("splash"); // splash, login, user_login, register, otp_verify, dashboard, kyc_flow, admin
  const [userRole, setUserRole] = useState("user"); // user | admin
  const [userId, setUserId] = useState(null);
  const [kycStatus, setKycStatus] = useState("none"); // none | submitted | approved | rejected
  const [kycStep, setKycStep] = useState(1); // 1..4
  const [isInitialized, setIsInitialized] = useState(false);

  // form data
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    idType: "aadhaar",
    idNumber: "",
    docFront: null,
    docBack: null,
    selfie: null,
  });

  // voice hook
  const voice = useVoice("en", true);
  const { lang, setLang, enabled: voiceEnabled, setEnabled: setVoiceEnabled, speak, cancelSpeech } = voice;

  // localization object computed for current language
  const t = useMemo(() => LOCALIZATION[lang] || LOCALIZATION.en, [lang]);

  // ---------- Persistence: load & save ----------
  useEffect(() => {
    const savedStatus = localStorage.getItem("kyc_status");
    const savedForm = localStorage.getItem("kyc_formData");
    const savedLang = localStorage.getItem("kyc_lang");

    if (savedStatus) setKycStatus(savedStatus);
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        // ignore parse error
      }
    }
    if (savedLang) setLang(savedLang);

    // splash -> login
    const timer = setTimeout(() => {
      setCurrentScreen("login");
      setIsInitialized(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [setLang]);

  useEffect(() => {
    localStorage.setItem("kyc_status", kycStatus);
    try {
      localStorage.setItem("kyc_formData", JSON.stringify(formData));
    } catch (e) {
      // ignore
    }
    localStorage.setItem("kyc_lang", lang);
  }, [kycStatus, formData, lang]);

  // ---------- Utilities ----------
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ---------- Handlers ----------
  const handleLogin = (type) => {
  if (type === "register") {
    setCurrentScreen("register");
    return;
  }

  if (type === "admin") {
    setUserRole("admin");
    setCurrentScreen("admin");
    return;
  }

  // USER LOGIN
  setUserRole("user");
  setCurrentScreen("user_login");
};


  // file upload handler
  const handleFileUpload = async (field, files) => {
  const fileArr = Array.isArray(files) ? files : [files];

  const meta = await Promise.all(
    fileArr.map(async (file) => ({
      name: file.name,
      type: file.type,
      preview: await toBase64(file),
    }))
  );

  setFormData((prev) => ({
    ...prev,
    [field]: {
      status: "uploaded",
      files: meta,
      uploadedAt: new Date().toISOString(),
    },
  }));
};


  // handle selfie captured
  const handleSelfieCapture = async (fileOrBase64) => {
  let selfieBase64 = fileOrBase64;

  if (fileOrBase64 instanceof File) {
    selfieBase64 = await toBase64(fileOrBase64);
  }

  setFormData((prev) => ({
    ...prev,
    selfie: {
      status: "captured",
      preview: selfieBase64,
      capturedAt: new Date().toISOString(),
    },
  }));
};

  // submit KYC
  const submitKYC = () => {
    setKycStatus("submitted");
    setCurrentScreen("dashboard");
    speak(t.voice_success);
  };

  // admin decision
  const adminAction = (action) => {
    setKycStatus(action);
    if (action === "approved") speak(t.voice_dashboard_approved);
    else speak(t.voice_dashboard_rejected);
  };

  // language change
  const changeLang = (L) => {
    setLang(L);
    localStorage.setItem("kyc_lang", L);
    setTimeout(() => speak(LOCALIZATION[L].voice_lang_changed), 50);
  };

  // toggle voice enabled
  const toggleVoiceEnabled = () => {
    setVoiceEnabled((v) => {
      const newVal = !v;
      if (newVal) {
        setTimeout(() => speak(t.voice_lang_changed || (lang === "hi" ? "भाषा सक्रिय हुई" : "Voice enabled")), 50);
      } else {
        cancelSpeech();
      }
      return newVal;
    });
  };

  // ---------- Screen / Step voice prompts ----------
  useEffect(() => {
    if (!isInitialized) return;
    if (currentScreen === "login") speak(t.voice_login);
  }, [currentScreen, isInitialized, lang, speak, t]);

  useEffect(() => {
    if (currentScreen === "user_login") speak(t.voice_user_login);
  }, [currentScreen, lang, speak, t]);

  useEffect(() => {
    if (currentScreen === "register") speak(t.voice_register);
  }, [currentScreen, lang, speak, t]);

  useEffect(() => {
    if (currentScreen === "otp_verify") speak(t.voice_otp);
  }, [currentScreen, lang, speak, t]);

  useEffect(() => {
    if (currentScreen === "dashboard") {
      if (kycStatus === "none") speak(t.voice_dashboard_start);
      else if (kycStatus === "submitted") speak(t.voice_dashboard_submitted);
      else if (kycStatus === "approved") speak(t.voice_dashboard_approved);
      else if (kycStatus === "rejected") speak(t.voice_dashboard_rejected);
    }
  }, [currentScreen, kycStatus, lang, speak, t]);

  useEffect(() => {
    if (currentScreen !== "kyc_flow") return;
    if (kycStep === 1) speak(t.voice_step1);
    else if (kycStep === 2) speak(t.voice_step2);
    else if (kycStep === 3) speak(t.voice_step3);
    else if (kycStep === 4) speak(t.voice_step4);
  }, [currentScreen, kycStep, lang, speak, t]);

  // ---------- Render ----------
  // SPLASH
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

  // MAIN APP SHELL
  return (
    <div className="flex justify-center bg-gray-200 h-screen font-sans select-none">
      <div className="w-full max-w-md h-full bg-white shadow-2xl relative flex flex-col overflow-hidden">

        {/* LOGIN SCREEN */}
        {currentScreen === "login" && (
          <div className="p-8 flex flex-col h-full justify-center bg-indigo-50">
            <div className="mb-8 text-center">
              <Shield size={64} className="text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">{t.app_name}</h2>
              <p className="text-gray-500">{t.voice_intro ?? t.voice_login}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleLogin("user")}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <User size={20} /> {t.login_user || "Login as User"}
              </button>

              <button
                onClick={() => handleLogin("admin")}
                className="w-full bg-white text-indigo-600 border border-indigo-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Briefcase size={20} /> {t.login_admin || "Login as Admin"}
              </button>
            </div>

            <button
              onClick={() => handleLogin("register")}
              className="w-full bg-white text-indigo-600 border border-indigo-300 py-3 rounded-xl font-bold shadow-sm mt-6"
            >
              {t.register || "Register New User"}
            </button>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => changeLang("en")}
                className={`px-4 py-2 rounded-full text-xs font-bold ${lang === "en" ? "bg-indigo-600 text-white" : "bg-white text-gray-500"}`}
              >
                English
              </button>

              <button
                onClick={() => changeLang("hi")}
                className={`px-4 py-2 rounded-full text-xs font-bold ${lang === "hi" ? "bg-indigo-600 text-white" : "bg-white text-gray-500"}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        )}

        {/* USER LOGIN / REGISTER / OTP */}
       {currentScreen === "user_login" && (
  <UserLogin
    setCurrentScreen={setCurrentScreen}
    setUserRole={setUserRole}
    setUserId={setUserId}   // <-- THIS MUST BE PRESENT
  />
)}

        {currentScreen === "register" && <RegisterUser setCurrentScreen={setCurrentScreen} />}
        {currentScreen === "otp_verify" && <OTPVerify setCurrentScreen={setCurrentScreen} />}

        {/* ADMIN PANEL */}
        {currentScreen === "admin" && (
  <AdminPanel
    t={t}
    status={kycStatus}
    formData={formData}
    adminAction={adminAction}
    setCurrentScreen={setCurrentScreen}
  />
)}


        {/* DASHBOARD */}
        {currentScreen === "dashboard" && (
          <div className="flex flex-col h-full relative">
            <div className="bg-indigo-900 text-white p-6 pb-10 rounded-b-[2.5rem] shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center border border-indigo-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{formData.name || "User"}</h3>
                    <p className="text-xs text-indigo-300">ID: 8839202</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleVoiceEnabled}
                    className={`p-2 rounded-full ${voiceEnabled ? "bg-indigo-700 text-white" : "bg-indigo-800 text-indigo-400"}`}
                    title={voiceEnabled ? "Disable voice" : "Enable voice"}
                  >
                    {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>

                  <button onClick={() => setCurrentScreen("login")} title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-indigo-300 text-sm">{t.status_label}</p>
                {kycStatus === "none" && <h1 className="text-gray-400 text-xl">{t.not_verified}</h1>}
                {kycStatus === "submitted" && <h1 className="text-yellow-400 text-xl">{t.kyc_pending}</h1>}
                {kycStatus === "approved" && <h1 className="text-green-400 text-xl">{t.approved}</h1>}
                {kycStatus === "rejected" && <h1 className="text-red-400 text-xl">{t.rejected}</h1>}
              </div>
            </div>

            <div className="flex-1 bg-gray-50 -mt-8 pt-12 px-6 overflow-y-auto">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] text-gray-600 font-bold">
                  <WifiOff size={12} /> {t.offline_mode}
                </div>
              </div>

              {kycStatus === "none" && (
                <div className="bg-white p-6 rounded-2xl shadow border border-indigo-50 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
                    <FileText size={32} />
                  </div>
                  <h3 className="font-bold text-lg">{t.app_name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{t.voice_intro || t.voice_dashboard_start}</p>

                  <button
                    onClick={() => {
                      setCurrentScreen("kyc_flow");
                      setKycStep(1);
                    }}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow"
                  >
                    {t.start_kyc} <ChevronRight size={18} />
                  </button>
                </div>
              )}

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

              {kycStatus === "approved" && (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center gap-4">
                  <CheckCircle size={32} className="text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">{t.approved}</h3>
                    <p className="text-green-600 text-xs">{t.verified_msg}</p>
                  </div>
                </div>
              )}

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

        {/* KYC FLOW */}
        {currentScreen === "kyc_flow" && (
          <KYCFlow
            t={t}
            kycStep={kycStep}
            setKycStep={setKycStep}
            formData={formData}
            setFormData={setFormData}
            handleFileUpload={handleFileUpload}
            submitKYC={submitKYC}
            speak={speak}
            handleSelfieCapture={handleSelfieCapture}
          />
        )}

      </div>
    </div>
  );
}
