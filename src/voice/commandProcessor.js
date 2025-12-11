// commandProcessor.js
export default function processCommand(cmd, ctx) {
  const {
    t,
    lang,
    speak,
    setCurrentScreen,
    setKycStep,
    kycStep,
    changeLang,
    setFormData,
    submitKYC,
  } = ctx;

  // LOGIN / REGISTER / ADMIN
  if (cmd.includes("login as user") || cmd.includes("यूज़र लॉगिन")) {
    return setCurrentScreen("user_login");
  }

  if (cmd.includes("register") || cmd.includes("रजिस्टर") || cmd.includes("नया अकाउंट")) {
    return setCurrentScreen("register");
  }

  if (cmd.includes("admin") || cmd.includes("एडमिन")) {
    return setCurrentScreen("admin");
  }

  if (cmd.includes("logout") || cmd.includes("लॉग आउट")) {
    return setCurrentScreen("login");
  }

  // LANGUAGE SWITCH
  if (cmd.includes("hindi") || cmd.includes("हिंदी")) {
    changeLang("hi");
    return speak("हिंदी चुनी गई");
  }

  if (cmd.includes("english") || cmd.includes("अंग्रेजी")) {
    changeLang("en");
    return speak("English selected");
  }

  // START KYC
  if (cmd.includes("start kyc") || cmd.includes("केवाईसी शुरू")) {
    setCurrentScreen("kyc_flow");
    setKycStep(1);
    return speak(t.voice_step1);
  }

  // NEXT
  if (cmd.includes("next") || cmd.includes("आगे जाओ") || cmd.includes("नेक्स्ट")) {
    if (kycStep < 4) {
      setKycStep((s) => s + 1);
      return speak(lang === "hi" ? "अगला कदम" : "Next step");
    }
  }

  // BACK
  if (cmd.includes("back") || cmd.includes("पीछे जाओ") || cmd.includes("बैक")) {
    if (kycStep > 1) {
      setKycStep((s) => s - 1);
      return speak(lang === "hi" ? "पिछला कदम" : "Going back");
    }
  }

  // UPLOAD FRONT
  if (cmd.includes("upload front") || cmd.includes("फ्रंट अपलोड") || cmd.includes("आगे वाला अपलोड")) {
    document.getElementById("frontInput")?.click();
    return speak(lang === "hi" ? "फ्रंट डॉक्यूमेंट अपलोड हो रहा है" : "Uploading front document");
  }

  // UPLOAD BACK
  if (cmd.includes("upload back") || cmd.includes("बैक अपलोड") || cmd.includes("पीछे वाला अपलोड")) {
    document.getElementById("backInput")?.click();
    return speak(lang === "hi" ? "बैक डॉक्यूमेंट अपलोड हो रहा है" : "Uploading back document");
  }

  // TAKE SELFIE
  if (cmd.includes("take selfie") || cmd.includes("सेल्फी लो") || cmd.includes("सेल्फी")) {
    setFormData((prev) => ({ ...prev, selfie: "active" }));
    return speak(lang === "hi" ? "कैमरा खुल रहा है" : "Opening camera");
  }

  // SUBMIT
  if (cmd.includes("submit") || cmd.includes("सबमिट") || cmd.includes("जमा करो")) {
    return submitKYC();
  }

  // UNKNOWN
  speak(lang === "hi" ? "कमांड समझ में नहीं आया" : "Command not recognized");
}
