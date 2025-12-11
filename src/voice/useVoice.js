// useVoice.js
import { useState, useCallback } from "react";

export default function useVoice(initialLang = "en", initialEnabled = true) {
  const [lang, setLang] = useState(initialLang);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(
    (text) => {
      if (!enabled || !text) return;

      try {
        window.speechSynthesis.cancel();
      } catch {}

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utter.rate = 0.95;

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utter);
    },
    [enabled, lang]
  );

  return { lang, setLang, enabled, setEnabled, speak, isSpeaking };
}
