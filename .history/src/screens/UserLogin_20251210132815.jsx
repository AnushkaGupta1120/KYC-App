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
  ArrowLeft,
} from "lucide-react";

import LOCALIZATION from "./data/localization";
import CameraView from "./components/CameraView";
import KYCFlow from "./screens/KYCFlow";

export default function App() {
  // SCREEN STATE
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userRole, setUserRole] = useState("user");
  const [lang, setLang] = useState("en");

  // REGISTRATION STATE
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [pendingRegistration, setPendingRegistration] = useState(null);

  // KYC FLOW STATE
  const [kycStatus, setKycStatus] = useState("none");
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

  // SPLASH SCREEN TIMER
  useEffect(() => {
    setTimeout(() => {
      setCurrentScreen("login");
    }, 2000);
  }, []);

  // EVENT HANDLERS
  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentScreen(role === "admin" ? "admin" : "dashboard");
  };

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

  // REGISTRATION HANDLERS
  const handleRegisterSubmit = (formData) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    setPendingRegistration({
      ...formData,
      otp,
      userId: `USER${Date.now()}`,
    });

    alert(`Your OTP is: ${otp}`);
    setCurrentScreen("otp_verify");
  };

  const handleOTPVerify = (enteredOTP) => {
    if (!pendingRegistration) {
      alert("Registration data missing. Please register again.");
      setCurrentScreen("register");
      return;
    }

    if (enteredOTP !== pendingRegistration.otp) {
      alert("Incorrect OTP. Try again.");
      return;
    }

    const newUser = {
      name: pendingRegistration.name,
      mobile: pendingRegistration.mobile,
      email: pendingRegistration.email,
      userId: pendingRegistration.userId,
      password: pendingRegistration.password,
      kycStatus: "none",
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    setPendingRegistration(null);

    alert("Registration successful! You can now login.");
    setCurrentScreen("login");
  };

  // SPLASH SCREEN
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

            {/* REGISTER LINK */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => setCurrentScreen("register")}
                  className="text-indigo-600 font-bold underline hover:text-indigo-700"
                >
                  Register here
                </button>
              </p>
            </div>

            {/* REGISTER LINK */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => setCurrentScreen("register")}
                  className="text-indigo-600 font-bold underline hover:text-indigo-700"
                >
                  Register here
                </button>
              </p>
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

        {/* REGISTER SCREEN */}
        {currentScreen === "register" && (
          <RegisterUser 
            setCurrentScreen={setCurrentScreen}
            onRegister={handleRegisterSubmit}
          />
        )}

        {/* OTP VERIFY SCREEN */}
        {currentScreen === "otp_verify" && (
          <OTPVerify 
            setCurrentScreen={setCurrentScreen}
            pendingRegistration={pendingRegistration}
            onVerify={handleOTPVerify}
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
                  <p className="text-gray-500 text-sm mb-6">{t.voice_intro}</p>

                  <button
                    onClick={() => setCurrentScreen("kyc_flow")}
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

                  <div className="p-4 grid grid-cols-2 gap-2">
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

// REGISTER USER COMPONENT
function RegisterUser({ setCurrentScreen, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.mobile || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    onRegister(form);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("login")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Register New User</h2>
        </div>
        <p className="text-indigo-200 text-sm">Create your account to get started</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <input type="checkbox" className="mt-1" required />
            <p className="text-xs text-gray-600">
              I agree to the Terms & Conditions and Privacy Policy
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}

// OTP VERIFY COMPONENT
function OTPVerify({ setCurrentScreen, pendingRegistration, onVerify }) {
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otpInput];
    newOTP[index] = value;
    setOtpInput(newOTP);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOTP = otpInput.join("");
    if (enteredOTP.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }
    onVerify(enteredOTP);
  };

  if (!pendingRegistration) {
    return (
      <div className="p-8 text-red-500 text-center">
        Registration data missing. Please register again.
        <button
          onClick={() => setCurrentScreen("register")}
          className="block mt-4 text-indigo-600 underline"
        >
          Go to Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("register")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Verify OTP</h2>
        </div>
        <p className="text-indigo-200 text-sm">
          Enter the 6-digit code sent to {pendingRegistration.mobile}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Shield size={40} className="text-indigo-600" />
          </div>

          <div className="flex justify-center gap-3">
            {otpInput.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(i, e.target.value)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600">
            Didn't receive code?{" "}
            <button className="text-indigo-600 font-bold underline">Resend OTP</button>
          </p>

          <button
            onClick={handleVerify}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} /> Verify & Register
          </button>
        </div>
      </div>
    </div>
  );
}

// REGISTER USER COMPONENT
function RegisterUser({ setCurrentScreen, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.mobile || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    onRegister(form);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("login")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Register New User</h2>
        </div>
        <p className="text-indigo-200 text-sm">Create your account to get started</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <input type="checkbox" className="mt-1" required />
            <p className="text-xs text-gray-600">
              I agree to the Terms & Conditions and Privacy Policy
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}

// OTP VERIFY COMPONENT
function OTPVerify({ setCurrentScreen, pendingRegistration, onVerify }) {
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otpInput];
    newOTP[index] = value;
    setOtpInput(newOTP);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOTP = otpInput.join("");
    if (enteredOTP.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }
    onVerify(enteredOTP);
  };

  if (!pendingRegistration) {
    return (
      <div className="p-8 text-red-500 text-center">
        Registration data missing. Please register again.
        <button
          onClick={() => setCurrentScreen("register")}
          className="block mt-4 text-indigo-600 underline"
        >
          Go to Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("register")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Verify OTP</h2>
        </div>
        <p className="text-indigo-200 text-sm">
          Enter the 6-digit code sent to {pendingRegistration.mobile}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Shield size={40} className="text-indigo-600" />
          </div>

          <div className="flex justify-center gap-3">
            {otpInput.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(i, e.target.value)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600">
            Didn't receive code?{" "}
            <button className="text-indigo-600 font-bold underline">Resend OTP</button>
          </p>

          <button
            onClick={handleVerify}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} /> Verify & Register
          </button>
        </div>
      </div>
    </div>
  );
}