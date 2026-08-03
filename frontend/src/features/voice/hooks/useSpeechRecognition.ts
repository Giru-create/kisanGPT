"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

function getSpeechRecognitionConstructor():
  (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    isSupported: false,
    isListening: false,
    transcript: "",
    interimTranscript: "",
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    const Ctor = getSpeechRecognitionConstructor();
    setState((prev) => ({
      ...prev,
      isSupported: !!Ctor,
    }));
  }, []);

  const cleanupRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.abort();
      } catch {
        // swallow — browser may have already cleaned up
      }
      recognitionRef.current = null;
    }
    isStartingRef.current = false;
  }, []);

  const startListening = useCallback(
    (lang: string = "hi-IN") => {
      if (isStartingRef.current) return;
      if (recognitionRef.current) {
        cleanupRecognition();
      }

      const Ctor = getSpeechRecognitionConstructor();
      if (!Ctor) {
        setState((prev) => ({
          ...prev,
          error: "Speech recognition is not supported in this browser.",
        }));
        return;
      }

      isStartingRef.current = true;

      const recognition = new Ctor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        isStartingRef.current = false;
        setState((prev) => ({
          ...prev,
          isListening: true,
          error: null,
          transcript: "",
          interimTranscript: "",
        }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result?.isFinal) {
            final += result[0]?.transcript ?? "";
          } else {
            interim += result?.[0]?.transcript ?? "";
          }
        }
        setState((prev) => ({
          ...prev,
          transcript: prev.transcript + final,
          interimTranscript: interim,
        }));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        isStartingRef.current = false;
        const errorType = event.error;
        let errorMsg: string;
        switch (errorType) {
          case "not-allowed":
            errorMsg =
              "Microphone access denied. Please grant permission in browser settings.";
            break;
          case "no-speech":
            errorMsg = "No speech detected. Please try speaking again.";
            break;
          case "network":
            errorMsg = "Network error. Please check your connection.";
            break;
          case "aborted":
            errorMsg = "";
            break;
          case "audio-capture":
            errorMsg = "No microphone found. Please connect a microphone.";
            break;
          case "service-not-allowed":
            errorMsg = "Speech service not allowed. Check browser settings.";
            break;
          case "language-not-supported":
            errorMsg =
              "The selected language is not supported for speech recognition.";
            break;
          default:
            errorMsg = `Speech recognition error: ${errorType}`;
        }

        if (errorMsg) {
          setState((prev) => ({
            ...prev,
            isListening: false,
            error: errorMsg,
            transcript: "",
            interimTranscript: "",
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isListening: false,
            transcript: "",
            interimTranscript: "",
          }));
        }
      };

      recognition.onend = () => {
        isStartingRef.current = false;
        setState((prev) => ({
          ...prev,
          isListening: false,
          interimTranscript: "",
        }));
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch {
        isStartingRef.current = false;
        setState((prev) => ({
          ...prev,
          error: "Failed to start speech recognition.",
        }));
      }
    },
    [cleanupRecognition],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: "",
      interimTranscript: "",
    }));
  }, []);

  useEffect(() => {
    return () => {
      cleanupRecognition();
    };
  }, [cleanupRecognition]);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}
