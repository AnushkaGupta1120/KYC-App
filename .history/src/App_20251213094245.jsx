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
  const lastSpeakRef = useRef(0);

  const cancelSpeech = useCallback(() => {
    if (window?.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text) => {
      if (!enabled || !text) return;
      if (!window?.speechSynthesis) return;

      const now = Date.now();
      if (now - lastSpeakRef.current < 700) return;
      lastSpeakRef.current = now;

      cancelSpeech();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utter.rate = 0.95;

      window.speechSynthesis.speak(utter);
    },
    [enabled, lang, cancelSpeech]
  );

  return { lang, setLang, enabled, setEnabled, speak, cancelSpeech };
}

// ---------- App ----------
export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userRole, setUserRole] = useState("user");
  const [kycStatus, setKycStatus] = useState("none");
  const [kycStep, setKycStep] = useState(1);
  const [rejectionReason, setRejectionReason] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    idType: "aadhaar",
    idNumber: "",
    docFront: null,
    docBack: null,
    selfie: null,
  });

  const voice = useVoice("en", true);
  const { lang, setLang, enabled: voiceEnabled, setEnabled: setVoiceEnabled, speak, cancelSpeech } = voice;
  const t = useMemo(() => LOCALIZATION[lang] || LOCALIZATION.en, [lang]);

  // ---------- Persistence ----------
  useEffect(() => {
    const saved = localStorage.getItem("kyc_formData");
    const savedStatus = localStorage.getItem("kyc_status");
    const savedReason = localStorage.getItem("kyc_rejection_reason");
    const savedLang = localStorage.getItem("kyc_lang");

    if (saved) setFormData(JSON.parse(saved));
    if (savedStatus) setKycStatus(savedStatus);
    if (savedReason) setRejectionReason(savedReason);
    if (savedLang) setLang(savedLang);

    setTimeout(() => setCurrentScreen("login"), 1200);
  }, [setLang]);

  useEffect(() => {
    localStorage.setItem("kyc_formData", JSON.stringify(formData));
    localStorage.setItem("kyc_status", kycStatus);
    localStorage.setItem("kyc_rejection_reason", rejectionReason);
    localStorage.setItem("kyc_lang", lang);
  }, [formData, kycStatus, rejectionReason, lang]);

  // ---------- Handlers ----------
  const handleLogin = (type) => {
    if (type === "register") return setCurrentScreen("register");
    if (type === "admin") {
      setUserRole("admin");
      return setCurrentScreen("admin");
    }
    setUserRole("user");
    setCurrentScreen("user_login");
  };

  const submitKYC = () => {
    setKycStatus("submitted");
    setCurrentScreen("dashboard");
    speak(t.voice_success);
  };

  // 🔴 FIXED ADMIN ACTION (REJECTION REASON + VOICE)
  const adminAction = (action, reason = "") => {
    setKycStatus(action);

    if (action === "approved") {
      setRejectionReason("");
      speak(t.voice_dashboard_approved);
    }

    if (action === "rejected") {
      setRejectionReason(reason);

      const msg =
        lang === "hi"
          ? `आपका केवाईसी अस्वीकृत कर दिया गया है। कारण है: ${reason}`
          : `Your KYC has been rejected. Reason: ${reason}`;

      speak(msg);
    }
  };

  const changeLang = (l) => {
    setLang(l);
    setTimeout(() => speak(LOCALIZATION[l].voice_lang_changed), 200);
  };

  const toggleVoice = () => {
    setVoiceEnabled((v) => {
      if (v) cancelSpeech();
      return !v;
    });
  };

  // ---------- RENDER ----------
  if (currentScreen === "splash") {
    return (
      <div className="flex items-center justify-center h-screen bg-indigo-900 text-white">
        <Shield size={48} />
      </div>
    );
  }

  return (
    <div className="flex justify-center h-screen bg-gray-200">
      <div className="w-full max-w-md bg-white shadow-xl">

        {/* LOGIN */}
        {currentScreen === "login" && (
          <div className="p-8 space-y-4">
            <button onClick={() => handleLogin("user")} className="btn">User Login</button>
            <button onClick={() => handleLogin("admin")} className="btn">Admin Login</button>
            <button onClick={() => handleLogin("register")} className="btn">Register</button>

            <div className="flex gap-3 justify-center">
              <button onClick={() => changeLang("en")}>EN</button>
              <button onClick={() => changeLang("hi")}>HI</button>
            </div>
          </div>
        )}

        {currentScreen === "user_login" && <UserLogin setCurrentScreen={setCurrentScreen} />}
        {currentScreen === "register" && <RegisterUser setCurrentScreen={setCurrentScreen} />}
        {currentScreen === "otp_verify" && <OTPVerify setCurrentScreen={setCurrentScreen} />}

        {/* ADMIN */}
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
            <h2>{kycStatus.toUpperCase()}</h2>

            {kycStatus === "rejected" && (
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="font-bold text-red-700">
                  {lang === "hi" ? "अस्वीकृति का कारण" : "Reason for Rejection"}
                </p>
                <p className="text-red-600">{rejectionReason}</p>
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
            submitKYC={submitKYC}
          />
        )}
      </div>
    </div>
  );
}
