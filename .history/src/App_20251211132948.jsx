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

  const THROTTLE_DELAY = 700;
  const lastSpeakRef = useRef(0);

  const cancelSpeech = useCallback(() => {
    try {
      window?.speechSynthesis?.cancel();
    } catch {}
  }, []);

  const speak = useCallback(
    (text, opts = {}) => {
      if (!enabled || !text) return;
      if (!window?.speechSynthesis || !window.SpeechSynthesisUtterance) return;

      const now = Date.now();
      if (now - lastSpeakRef.current < THROTTLE_DELAY) return;
      lastSpeakRef.current = now;

      cancelSpeech();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utter.rate = opts.rate ?? 0.95;
      utter.pitch = opts.pitch ?? 1;

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utter);
    },
    [enabled, lang, cancelSpeech]
  );

  return { lang, setLang, enabled, setEnabled, isSpeaking, speak, cancelSpeech };
}

// ---------- App Component ----------
export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userRole, setUserRole] = useState("user");
  const [userId, setUserId] = useState(null);

  const [kycStatus, setKycStatus] = useState("none");
  const [kycStep, setKycStep] = useState(1);

  const [rejectionReason, setRejectionReason] = useState("");

  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    idType: "aadhaar",
    idNumber: "",
    docFront: null,
    docBack: null,
    selfie: null,
  });

  // Voice
  const voice = useVoice("en", true);
  const { lang, setLang, enabled: voiceEnabled, setEnabled: setVoiceEnabled, speak, cancelSpeech } =
    voice;

  const t = useMemo(() => LOCALIZATION[lang] || LOCALIZATION.en, [lang]);

  // ---------- LOAD from localStorage ----------
  useEffect(() => {
    const savedStatus = localStorage.getItem("kyc_status");
    const savedForm = localStorage.getItem("kyc_formData");
    const savedLang = localStorage.getItem("kyc_lang");
    const savedReason = localStorage.getItem("rejection_reason");

    if (savedStatus) setKycStatus(savedStatus);
    if (savedLang) setLang(savedLang);
    if (savedReason) setRejectionReason(savedReason);

    if (savedForm) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedForm) }));
      } catch {}
    }

    setTimeout(() => {
      setCurrentScreen("login");
      setIsInitialized(true);
    }, 1000);
  }, []);

  // ---------- SAVE to localStorage ----------
  useEffect(() => {
    localStorage.setItem("kyc_status", kycStatus);
    localStorage.setItem("rejection_reason", rejectionReason);

    try {
      localStorage.setItem("kyc_formData", JSON.stringify(formData));
    } catch {}

    localStorage.setItem("kyc_lang", lang);
  }, [kycStatus, rejectionReason, formData, lang]);

  // ---------- UTIL ----------
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ---------- LOGIN ----------
  const handleLogin = (role) => {
    if (role === "register") return setCurrentScreen("register");
    if (role === "user") return setCurrentScreen("user_login");
    if (role === "admin") return setCurrentScreen("admin");
  };

  // ---------- FILE UPLOAD ----------
  const handleFileUpload = async (field, files) => {
    const file = Array.isArray(files) ? files[0] : files;

    const meta = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
      preview: await toBase64(file),
    };

    setFormData((p) => ({
      ...p,
      [field]: { status: "uploaded", file: meta },
    }));

    speak(field === "docFront" ? t.voice_doc_front : t.voice_doc_back);
  };

  // ---------- SELFIE ----------
  const handleSelfieCapture = async (file) => {
    let base64 = file instanceof File ? await toBase64(file) : file;

    setFormData((p) => ({
      ...p,
      selfie: { status: "captured", data: base64 },
    }));

    speak(t.voice_selfie_taken);
  };

  // ---------- SUBMIT KYC ----------
  const submitKYC = () => {
    setKycStatus("submitted");
    setCurrentScreen("dashboard");
    speak(t.voice_success);
  };

  // ---------- ADMIN ACTION (NOW SUPPORTS REASON) ----------
  const adminAction = (action, reason = "") => {
    setKycStatus(action);

    if (action === "rejected") {
      setRejectionReason(reason);
      speak(t.voice_dashboard_rejected);
    } else {
      setRejectionReason("");
      speak(t.voice_dashboard_approved);
    }
  };

  // ---------- LANGUAGE ----------
  const changeLang = (L) => {
    setLang(L);
    localStorage.setItem("kyc_lang", L);
    setTimeout(() => speak(LOCALIZATION[L].voice_lang_changed), 50);
  };

  const toggleVoiceEnabled = () => {
    setVoiceEnabled((v) => {
      const newVal = !v;
      if (!newVal) cancelSpeech();
      return newVal;
    });
  };

  // ---------- VOICE PROMPTS ----------
  useEffect(() => {
    if (!isInitialized) return;
    if (currentScreen === "login") speak(t.voice_login);
  }, [currentScreen, isInitialized, lang]);

  // ---------- RENDER ----------
  if (currentScreen === "splash") {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-900 text-white">
        <h1 className="text-3xl font-bold">TrustCheck</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-200 h-screen">
      <div className="max-w-md w-full bg-white shadow-xl">

        {/* LOGIN SCREENS */}
        {currentScreen === "login" && (
          <div className="p-8 text-center">
            <h1 className="text-xl font-bold">{t.app_name}</h1>

            <button onClick={() => handleLogin("user")} className="w-full mt-6 bg-indigo-600 text-white p-3 rounded-xl">
              Login as User
            </button>

            <button onClick={() => handleLogin("admin")} className="w-full mt-4 border p-3 rounded-xl">
              Login as Admin
            </button>
          </div>
        )}

        {currentScreen === "user_login" && (
          <UserLogin setCurrentScreen={setCurrentScreen} setUserRole={setUserRole} setUserId={setUserId} />
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
            rejectionReason={rejectionReason}
          />
        )}

        {/* DASHBOARD */}
        {currentScreen === "dashboard" && (
          <div className="p-6">
            <h1 className="text-xl font-bold">{t.status_label}</h1>

            {kycStatus === "rejected" && (
              <div className="bg-red-100 p-4 rounded-xl mt-4">
                <p className="text-red-700 font-bold">Rejected</p>
                <p className="text-red-600 text-sm mt-1">
                  {rejectionReason || t.rejected_msg}
                </p>
              </div>
            )}

            {kycStatus === "approved" && (
              <div className="bg-green-100 p-4 rounded-xl mt-4">
                <p className="text-green-700 font-bold">Approved</p>
              </div>
            )}
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
            handleSelfieCapture={handleSelfieCapture}
            submitKYC={submitKYC}
          />
        )}
      </div>
    </div>
  );
}
