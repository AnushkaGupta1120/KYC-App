// src/App.jsx
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";

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

// ---------------- VOICE HOOK --------------------
function useVoice(initialLang = "en", initialEnabled = true) {
  const [lang, setLang] = useState(initialLang);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const THROTTLE_DELAY = 700;
  const lastSpeakRef = useRef(0);

  const cancelSpeech = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {}
  }, []);

  const speak = useCallback(
    (text, opts = {}) => {
      if (!enabled || !text) return;

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

      window.speechSynthesis?.speak(utter);
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

// ---------------- MAIN APP --------------------
export default function App() {
  // ---------- GLOBAL STATE ----------
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userRole, setUserRole] = useState("user");
  const [kycStatus, setKycStatus] = useState("none");
  const [kycStep, setKycStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const [userId, setUserId] = useState(null); // ✔ FIXED: inside App()

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    idType: "aadhaar",
    idNumber: "",
    docFront: null,
    docBack: null,
    selfie: null,
  });

  // ---------- VOICE ----------
  const voice = useVoice();
  const { lang, setLang, enabled: voiceEnabled, setEnabled: setVoiceEnabled, speak, cancelSpeech } = voice;

  const t = useMemo(() => LOCALIZATION[lang], [lang]);

  // ---------- LOAD ON START ----------
  useEffect(() => {
    const savedStatus = localStorage.getItem("kyc_status");
    const savedForm = localStorage.getItem("kyc_formData");
    const savedLang = localStorage.getItem("kyc_lang");

    const savedLogin = localStorage.getItem("is_logged_in");
    const savedUserId = localStorage.getItem("user_id");

    if (savedStatus) setKycStatus(savedStatus);
    if (savedLang) setLang(savedLang);
    if (savedForm) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedForm) }));
      } catch {}
    }

    const timer = setTimeout(() => {
      if (savedLogin === "true" && savedUserId) {
        setUserId(savedUserId);
        setCurrentScreen("dashboard");
      } else {
        setCurrentScreen("login");
      }
      setIsInitialized(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // ---------- SAVE TO LOCAL STORAGE ----------
  useEffect(() => {
    localStorage.setItem("kyc_status", kycStatus);
    localStorage.setItem("kyc_formData", JSON.stringify(formData));
    localStorage.setItem("kyc_lang", lang);
  }, [kycStatus, formData, lang]);

  // ---------- UTIL ----------
  const toBase64 = (file) =>
    new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.readAsDataURL(file);
    });

  // ---------- LOGIN SELECT ----------
  const handleLogin = (role) => {
    if (role === "register") setCurrentScreen("register");
    if (role === "user") setCurrentScreen("user_login");
    if (role === "admin") setCurrentScreen("admin");
  };

  // ---------- FILE UPLOAD ----------
  const handleFileUpload = async (field, files) => {
    const file = Array.isArray(files) ? files[0] : files;
    const preview = await toBase64(file);

    setFormData((prev) => ({
      ...prev,
      [field]: { status: "uploaded", file, preview },
    }));

    speak(field === "docFront" ? t.voice_doc_front : t.voice_doc_back);
  };

  // ---------- SELFIE ----------
  const handleSelfieCapture = async (file) => {
    const preview = file instanceof File ? await toBase64(file) : file;

    setFormData((p) => ({
      ...p,
      selfie: { status: "captured", data: preview },
    }));

    speak(t.voice_selfie_taken);
  };

  // ---------- SUBMIT ----------
  const submitKYC = () => {
    setKycStatus("submitted");
    speak(t.voice_success);
    setCurrentScreen("dashboard");
  };

  // ---------- ADMIN ACTION ----------
  const adminAction = (action) => {
    setKycStatus(action);
    speak(action === "approved" ? t.voice_dashboard_approved : t.voice_dashboard_rejected);
  };

  // ---------- LANGUAGE ----------
  const changeLang = (L) => {
    setLang(L);
    localStorage.setItem("kyc_lang", L);
    setTimeout(() => speak(LOCALIZATION[L].voice_lang_changed), 100);
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("user_id");
    setUserId(null);
    setCurrentScreen("login");
  };

  // ---------- SCREEN VOICE PROMPTS ----------
  useEffect(() => {
    if (!isInitialized) return;
    if (currentScreen === "login") speak(t.voice_login);
    if (currentScreen === "user_login") speak(t.voice_user_login);
    if (currentScreen === "register") speak(t.voice_register);
    if (currentScreen === "otp_verify") speak(t.voice_otp);
  }, [currentScreen, isInitialized, t]);

  useEffect(() => {
    if (currentScreen !== "dashboard") return;

    if (kycStatus === "none") speak(t.voice_dashboard_start);
    if (kycStatus === "submitted") speak(t.voice_dashboard_submitted);
    if (kycStatus === "approved") speak(t.voice_dashboard_approved);
    if (kycStatus === "rejected") speak(t.voice_dashboard_rejected);
  }, [currentScreen, kycStatus, t]);

  useEffect(() => {
    if (currentScreen !== "kyc_flow") return;
    if (kycStep === 1) speak(t.voice_step1);
    if (kycStep === 2) speak(t.voice_step2);
    if (kycStep === 3) speak(t.voice_step3);
    if (kycStep === 4) speak(t.voice_step4);
  }, [currentScreen, kycStep, t]);

  // ---------------- RENDER --------------------

  if (currentScreen === "splash") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-900 text-white">
        <Shield size={48} className="mb-4" />
        <h1 className="text-3xl font-bold">TrustCheck</h1>
        <p className="text-sm opacity-70">Secure Identity Verification</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-200 h-screen">
      <div className="w-full max-w-md bg-white shadow-xl flex flex-col">

        {/* LOGIN */}
        {currentScreen === "login" && (
          <div className="p-8 h-full flex flex-col justify-center">
            <Shield size={64} className="text-indigo-600 mx-auto mb-4" />

            <button
              className="bg-indigo-600 text-white py-3 rounded-xl mb-3"
              onClick={() => handleLogin("user")}
            >
              Login as User
            </button>

            <button
              className="border py-3 rounded-xl mb-3"
              onClick={() => handleLogin("admin")}
            >
              Login as Admin
            </button>

            <button
              className="border py-3 rounded-xl"
              onClick={() => handleLogin("register")}
            >
              Register New User
            </button>

            {/* LANG BUTTONS */}
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => changeLang("en")}>English</button>
              <button onClick={() => changeLang("hi")}>हिन्दी</button>
            </div>
          </div>
        )}

        {/* USER LOGIN */}
        {currentScreen === "user_login" && (
  <UserLogin
    setCurrentScreen={setCurrentScreen}
    setUserRole={setUserRole}
    setUserId={setUserId}   // FIXED
  />
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
            formData={formData}
            status={kycStatus}
            adminAction={adminAction}
            setCurrentScreen={setCurrentScreen}
          />
        )}

        {/* DASHBOARD */}
        {currentScreen === "dashboard" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Welcome {userId}</h2>
              <button onClick={logout}>
                <LogOut size={20} />
              </button>
            </div>

            {kycStatus === "none" && (
              <button
                className="w-full bg-indigo-600 text-white py-3 rounded-xl"
                onClick={() => {
                  setCurrentScreen("kyc_flow");
                  setKycStep(1);
                }}
              >
                Start KYC
              </button>
            )}

            {kycStatus === "submitted" && (
              <p className="text-yellow-500">Your KYC is under review.</p>
            )}

            {kycStatus === "approved" && (
              <p className="text-green-600">Your KYC is approved.</p>
            )}

            {kycStatus === "rejected" && (
              <p className="text-red-500">Your KYC was rejected.</p>
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
            submitKYC={submitKYC}
            speak={speak}
            handleSelfieCapture={handleSelfieCapture}
          />
        )}
      </div>
    </div>
  );
}
