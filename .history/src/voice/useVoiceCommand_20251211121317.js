// useVoiceCommands.js
import { useEffect, useRef, useState } from "react";

export default function useVoiceCommands({ onCommand }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "hi-IN";       // Supports Hindi + Hinglish + English
    recog.continuous = false;
    recog.interimResults = false;

    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);

    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase().trim();
      onCommand(transcript);
    };

    recognitionRef.current = recog;
  }, [onCommand]);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  return { listening, startListening };
}
