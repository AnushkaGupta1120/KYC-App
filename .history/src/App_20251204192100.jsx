export default function App() {
  // --- STATE MANAGEMENT ---
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

  // --- VOICE LOGIC ---
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
  // 1. Load Persisted Data
  useEffect(() => {
    const savedStatus = localStorage.getItem('kyc_status');
    const savedForm = localStorage.getItem('kyc_formData');
    const savedLang = localStorage.getItem('kyc_lang');

    if (savedStatus) setKycStatus(savedStatus);
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedLang && LOCALIZATION[savedLang]) {
      setLang(savedLang);
    }

    const splashTimer = setTimeout(() => {
      setCurrentScreen('login');
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  // 2. Persist Data
  useEffect(() => {
    localStorage.setItem('kyc_status', kycStatus);
    localStorage.setItem('kyc_formData', JSON.stringify(formData));
    localStorage.setItem('kyc_lang', lang);
  }, [kycStatus, formData, lang]);

  // 3. Voice Triggers & FALLBACK LOCALIZATION
  // IMPORTANT: Default to English if lang is invalid
  const t = LOCALIZATION[lang] || LOCALIZATION['en'];
  
  useEffect(() => {
    if (currentScreen === 'dashboard' && kycStatus === 'none') speak(t.voice_intro);
    if (currentScreen === 'kyc_flow') {
       if (kycStep === 1) speak(t.voice_step1);
       if (kycStep === 2) speak(t.voice_step2);
       if (kycStep === 3) speak(t.voice_step3);
    }
  }, [currentScreen, kycStep, lang, kycStatus]);

  // --- ACTIONS ---
  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentScreen(role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLangChange = (l) => {
    setLang(l);
    speak(l === 'hi' ? "हिंदी भाषा चुनी गई" : "Language set to English");
  };

  const handleFileUpload = (field) => {
    setTimeout(() => {
      setFormData(prev => ({ ...prev, [field]: 'file_uploaded' }));
      speak(lang === 'hi' ? "फाइल अपलोड हो गई।" : "File uploaded.");
    }, 1000);
  };

  const submitKYC = () => {
    setKycStatus('submitted');
    setCurrentScreen('dashboard');
    speak(LOCALIZATION[lang] ? LOCALIZATION[lang].voice_success : LOCALIZATION['en'].voice_success);
  };

  const resetKyc = () => {
    setKycStatus('none');
    setKycStep(1);
  };

  // --- RENDER ---
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

  return (
    <div className="flex justify-center bg-gray-200 h-screen font-sans overflow-hidden select-none">
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col overflow-hidden">
        
        <button 
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full ${isSpeaking ? 'bg-orange-500 animate-pulse' : 'bg-gray-100'} shadow-sm`}
        >
          {voiceEnabled ? <Volume2 size={20} className={isSpeaking ? 'text-white' : 'text-gray-600'}/> : <VolumeX size={20} className="text-gray-400"/>}
        </button>

        {currentScreen === 'login' && (
          <LoginScreen 
            t={t} 
            onLogin={handleLogin} 
            onLangChange={handleLangChange} 
            currentLang={lang} 
          />
        )}

        {currentScreen === 'dashboard' && (
           <Dashboard 
             t={t} 
             user={formData} 
             status={kycStatus} 
             setScreen={setCurrentScreen}
             setStatus={setKycStatus}
             resetKyc={resetKyc}
           />
        )}

        {currentScreen === 'kyc_flow' && (
          <KYCFlow 
            t={t}
            step={kycStep}
            setStep={setKycStep}
            formData={formData}
            setFormData={setFormData}
            submit={submitKYC}
            onBack={() => setCurrentScreen('dashboard')}
            onFileUpload={handleFileUpload}
            isSpeaking={isSpeaking}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminPanel 
            t={t}
            status={kycStatus}
            formData={formData}
            setStatus={setKycStatus}
            setScreen={setCurrentScreen}
          />
        )}

      </div>
    </div>
  );
}