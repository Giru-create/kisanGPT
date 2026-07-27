// ─────────────────────────────────────────────────────────────────────────────
// useAudioPlayer.ts
// KisanGPT — Audio Playback Manager Hook
// Manages HTML5 Audio playback, scrub bar progress, and speed control
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number; // 1.0, 1.25, 1.5
}

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(
    (srcOrBase64: string, mimeType: string = "audio/mp3") => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const src = srcOrBase64.startsWith("data:") || srcOrBase64.startsWith("http")
        ? srcOrBase64
        : `data:${mimeType};base64,${srcOrBase64}`;

      const audio = new Audio(src);
      audioRef.current = audio;
      audio.playbackRate = playbackRate;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 0);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime || 0);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        setIsPlaying(false);
      };

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    },
    [playbackRate],
  );

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const seek = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const changeSpeed = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    playAudio,
    togglePlayPause,
    seek,
    changeSpeed,
  };
}
