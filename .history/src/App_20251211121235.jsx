// src/App.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
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

// VOICE ENGINE (EXTERNAL FILES)
import useVoice from "./voice/useVoice";
import useVoiceCommands from "./voice/useVoiceCommands";
import processCommand from "./voice/commandProcessor";

import LOCALIZATION from "./data/localization";

export default function App() {
  // ---------------- GLOBAL STATE ----------------
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userRole, setUserRole] = useState("user");
  const [kycStatus, setKycStatus] = useState("none");
  const [kycStep, setKycStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    idType: "aadhaar",
    idNumber: "",
    docFront: null,
    docBack: null,
    selfie: null,
  });

  // ---------------- VOICE SETUP ----------------
  const voice = useVoice("en", true);

  const {
    lang,
    setLang,
    enabled: voiceEnabled,
    setEnabled: setVoiceEnabled,
    speak,
  } = voice;

  // Localization per language
  const t = useMemo(() => LOCALIZATION[lang] || LOCALIZATION.en, [lang]);

  // ---------------- LOAD SAVED DATA ----------------
  useEffect(() => {
    const savedStatus = localStorage.getItem("kyc_status");
    const savedForm = localStorage.getItem("kyc_formData");
    const savedLang = localStorage.getItem("kyc_lang");

    if (savedStatus) setKycStatus(savedStatus);

    if (savedForm) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedForm) }));
      } catch {}
    }

    if (savedLang) setLang(savedLang);

    setTimeout(() => setCurrentScreen("login"), 1200);
  }, [setLang]);

  // ---------------- VOICE COMMAND LISTENING ----------------
  const { listening, startListening } = useVoiceCommands({
    onCommand: (cmd) =>
      processCommand(cmd, {
        t,
        lang,
        speak,
        setCurrentScreen,
        setKycStep,
        kycStep,
        changeLang: setLang,
        setFormData,
        submitKYC,
      }),
  });

  // ---------------- SAVE STATE ----------------
  useEffect(() => {
    localStorage.setItem("kyc_status", kycStatus);
    localStorage.setItem("kyc_formData", JSON.stringify(formData));
    localStorage.setItem("kyc_lang", lang);
  }, [kycStatus, formData, lang]);

  // ---------------- HELPERS ----------------
  const toBase64 = (file) =>
    new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.readAsDataURL(file);
    });

  // ---------------- LOGIN HANDLER ----------------
  const handleLogin = (role) => {
    if (role === "register") return setCurrentScreen("register");
    if (role === "user") return setCurrentScreen("user_login");
    if (role === "admin") return setCurrentScreen("admin");
  };

  // ---------------- FILE UPLOAD HANDLER ----------------
  const handleFileUpload = async (field, files) => {
    const fileArr = Array.isArray(files) ? files : [files];

    const processed = await Promise.all(
      fileArr.map(async (f) => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + " MB",
        type: f.type,
        preview: await toBase64(f),
        lastModified: new Date(f.lastModified).toLocaleString(),
      }))
    );

    setFormData((prev) => ({
      ...prev,
      [field]: {
        status: "uploaded",
        files: processed,
        fileCount: processed.length,
        uploadedAt: new Date().toISOString(),
      },
    }));

    speak(lang === "hi" ? "फ़ाइल अपलोड हो गई" : "File uploaded");
  };

  // ---------------- SUBMIT KYC ----------------
  function submitKYC() {
    setKycStatus("submitted");
    setCurrentScreen("dashboard");
    speak(lang === "hi" ? "आपका KYC जमा हो गया है" : "Your KYC has been submitted");
  }

  // ---------------- ADMIN ACTION ----------------
  const adminAction = (action) => {
    setKycStatus(action);
    speak(
      action === "approved"
        ? lang === "hi"
          ? "KYC स्वीकृत"
          : "KYC approved"
        : lang === "hi"
        ? "KYC अस्वीकृत"
        : "KYC rejected"
    );
  };

  // ---------------- LANGUAGE SWITCH ----------------
  const changeLang = (L) => {
    setLang(L);
    speak(L === "hi" ? "हिन्दी चुनी गई" : "Language set to English");
  };

  // ---------------- VOICE PROMPTS ----------------
  useEffect(() => {
    if (currentScreen !== "kyc_flow") return;

    const msgs = {
      1: lang === "hi" ? "कृपया अपना विवरण भरें" : "Please fill your personal details",
      2: lang === "hi" ? "अपना दस्तावेज़ अपलोड करें" : "Upload your documents",
      3: lang === "hi" ? "कृपया एक सेल्फी लें" : "Please take a selfie",
      4: lang === "hi" ? "जमा करने से पहले समीक्षा करें" : "Review before submitting",
    };

    speak(msgs[kycStep]);
  }, [kycStep, currentScreen, lang, speak]);

  // ---------------- UI ----------------

  // SPLASH SCREEN
  if (currentScreen === "splash") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-900 text-white">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
          <Shield size={48} className="text-indigo-900" />
        </div>
        <h1 className="text-3xl font-bold">TrustCheck</h1>
        <p className="text-indigo-300">Secure Identity Verification</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-200 h-screen">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">

        {/* LOGIN SCREEN */}
        {currentScreen === "login" && (
          <div className="p-8 flex flex-col h-full justify-center bg-indigo-50">
            <Shield size={64} className="text-indigo-600 mx-auto mb-4" />

            <button
              onClick={() => handleLogin("user")}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold mt-6"
            >
              {t.login_user}
            </button>

            <button
              onClick={() => handleLogin("admin")}
              className="w-full bg-white text-indigo-600 border py-4 rounded-xl font-bold mt-4"
            >
              {t.login_admin}
            </button>

            <button
              onClick={() => handleLogin("register")}
              className="w-full bg-white text-indigo-600 border py-3 rounded-xl font-bold mt-6"
            >
              {t.register}
            </button>

            {/* LANGUAGE SWITCH */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => changeLang("en")}
                className={`px-4 py-2 rounded-full text-xs font-bold ${
                  lang === "en" ? "bg-indigo-600 text-white" : "bg-white text-gray-600"
                }`}
              >
                English
              </button>

              <button
                onClick={() => changeLang("hi")}
                className={`px-4 py-2 rounded-full text-xs font-bold ${
                  lang === "hi" ? "bg-indigo-600 text-white" : "bg-white text-gray-600"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        )}

        {/* AUTH SCREENS */}
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
          />
        )}

        {/* DASHBOARD */}
        {currentScreen === "dashboard" && (
          <div className="flex flex-col h-full">
            <div className="bg-indigo-900 text-white p-6 pb-10 rounded-b-3xl shadow-lg flex justify-between">
              <h3 className="font-bold">{formData.name || "User"}</h3>

              <button onClick={() => setVoiceEnabled(!voiceEnabled)}>
                {voiceEnabled ? <Volume2 /> : <VolumeX />}
              </button>
            </div>

            <div className="px-6 pt-10 flex-1 overflow-auto">
              {kycStatus === "none" && (
                <button
                  onClick={() => {
                    setCurrentScreen("kyc_flow");
                    setKycStep(1);
                  }}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-4"
                >
                  {t.start_kyc}
                </button>
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
          />
        )}
      </div>
    </div>
  );
}
