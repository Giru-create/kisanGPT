// ─────────────────────────────────────────────────────────────────────────────
// useAudioRecorder.ts
// KisanGPT — Web Audio API & MediaRecorder Hook
// Manages microphone input, volume analysis, and audio blob generation
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioRecorderState {
  isRecording: boolean;
  volumeLevel: number; // 0.0 - 1.0 normalized
  permissionDenied: boolean;
  audioBlob: Blob | null;
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (
        !mediaRecorderRef.current ||
        mediaRecorderRef.current.state === "inactive"
      ) {
        setIsRecording(false);
        setVolumeLevel(0);
        resolve(audioBlob);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mediaRecorderRef.current?.mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        setIsRecording(false);
        setVolumeLevel(0);

        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
          audioContextRef.current.close().catch(() => {});
        }

        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [audioBlob]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      setPermissionDenied(false);
      audioChunksRef.current = [];
      setAudioBlob(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup Web Audio API Analyzer for real-time waveform volume
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] ?? 0;
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, Math.max(0, avg / 128));
        setVolumeLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Setup MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      return true;
    } catch (err) {
      console.error("Microphone access error:", err);
      if (
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
      ) {
        setPermissionDenied(true);
      }
      setIsRecording(false);
      return false;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isRecording,
    volumeLevel,
    permissionDenied,
    audioBlob,
    startRecording,
    stopRecording,
  };
}
