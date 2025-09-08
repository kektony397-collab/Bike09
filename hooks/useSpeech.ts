
import { useState, useCallback } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const speak = useCallback((text: string) => {
    if (!synth) {
      console.warn("Text-to-speech not supported in this browser.");
      return;
    }

    if (synth.speaking) {
      console.warn("Speech synthesis is already in progress.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("SpeechSynthesisUtterance.onerror", event);
      setIsSpeaking(false);
    };
    
    synth.speak(utterance);
  }, [synth]);

  return { isSpeaking, speak };
};
