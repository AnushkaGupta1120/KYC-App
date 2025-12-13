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

/* ---------------- VOICE HOOK ---------------- */
function useVoice(initialLang = "en", initialEnabled = true) {
  const [lang, setLang] = useState(initialLang);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpeakRef = useRef(0);

  const speak = useCallback(
    (text) => {
      if (!enabled || !text) return;
      if (!window.speechSynthesis) return;

      const now = Date.now();
      if (now - lastSpeakRef.current < 700) return;
      lastSpeakRef.current = now;

      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === "hi" ? "hi-IN" : "en-IN";
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(u);
    },
    [enabled, lang]
  );

  return { lang, setLang, enabled, setEnabled, speak };
}

/* ---------------- APP ---------------- */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userRole, setUserRole] = useState("user");
  const [kycStatus, setKycStatus] = useState("none");
  const [kycStep, setKycStep] = useState(1);
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

  const voice = useVoice("en", true);
  const { lang, setLang, enabled: voiceEnabled, setEnabled, speak } = voice;
  const t = useMemo(() => LOCALIZATION[lang], [lang]);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("login");
      setIsInitialized(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- NAVIGATION HANDLER ---------------- */
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

    setUserRole("user");
    setCurrentScreen("user_login");
  };

  /* ---------------- VOICE PROMPTS ---------------- */
  useEffect(() => {
    if (!isInitialized) return;
    if (currentScreen === "login") speak(t.voice_login);
    if (currentScreen === "register") speak(t.voice_register);
    if (currentScreen === "otp_verify") speak(t.voice_otp);
  }, [currentScreen, isInitialized, lang]);

  /* ---------------- SPLASH ---------------- */
  if (currentScreen === "splash") {
    return (
      <div className="flex items-center justify-center h-screen bg-indigo-900 text-white">
        <div className="text-center">
          <Shield size={64} className="mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold">TrustCheck</h1>
          <p className="text-indigo-300">Secure Identity Verification</p>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN ---------------- */
  return (
    <div className="flex justify-center bg-gray-200 h-screen">
      <div className="w-full max-w-md bg-white shadow-2xl">

        {/* LOGIN */}
        {currentScreen === "login" && (
          <div className="p-8 text-center space-y-4">
            <Shield size={64} className="mx-auto text-indigo-600" />

            <button
              onClick={() => handleLogin("user")}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold"
            >
              Login as User
            </button>

            <button
              onClick={() => handleLogin("admin")}
              className="w-full border py-4 rounded-xl font-bold text-indigo-600"
            >
              Login as Admin
            </button>

            <button
              onClick={() => handleLogin("register")}
              className="w-full border py-3 rounded-xl font-bold text-indigo-600"
            >
              Register New User
            </button>

            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setLang("en")}>English</button>
              <button onClick={() => setLang("hi")}>हिन्दी</button>
            </div>
          </div>
        )}

        {/* USER LOGIN */}
        {currentScreen === "user_login" && (
          <UserLogin setCurrentScreen={setCurrentScreen} />
        )}

        {/* REGISTER */}
        {currentScreen === "register" && (
          <RegisterUser setCurrentScreen={setCurrentScreen} />
        )}

        {/* OTP */}
        {currentScreen === "otp_verify" && (
          <OTPVerify setCurrentScreen={setCurrentScreen} />
        )}

        {/* ADMIN */}
        {currentScreen === "admin" && (
          <AdminPanel
            t={t}
            status={kycStatus}
            formData={formData}
            adminAction={setKycStatus}
            setCurrentScreen={setCurrentScreen}
          />
        )}

        {/* KYC FLOW */}
        {currentScreen === "kyc_flow" && (
          <KYCFlow
            t={t}
            kycStep={kycStep}
            setKycStep={setKycStep}
            formData={formData}
            setFormData={setFormData}
            submitKYC={() => {
              setKycStatus("submitted");
              setCurrentScreen("dashboard");
            }}
            speak={speak}
          />
        )}
      </div>
    </div>
  );
}
