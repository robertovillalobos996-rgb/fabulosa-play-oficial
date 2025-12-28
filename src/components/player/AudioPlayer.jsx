import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

export default function AudioPlayer({ station, autoPlay = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current && station?.stream_url) {
      const audio = audioRef.current;
      if (!audio.paused) audio.pause();

      audio.src = station.stream_url;
      audio.volume = volume / 100;
      audio.load();

      if (autoPlay) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Auto-play failed:", error);
            setIsLoading(false);
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station?.stream_url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      try {
        await audio.play();
      } catch (error) {
        console.error("Playback failed:", error);
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume / 100;
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    } else {
      setVolume(70);
      if (audioRef.current) audioRef.current.volume = 0.7;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <div className="bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] rounded-3xl border border-white/10 p-12 shadow-2xl">
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <img
              src={
                station.logo ||
                station.logo_url ||
                "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69461c3d47b7013a4cbd935e/2ccc752a6_logo-fabulosa.png"
              }
              alt={station.name}
              className="w-64 h-64 object-contain"
              crossOrigin="anonymous"
            />
            {isPlaying && (
              <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-3xl opacity-20 blur-xl animate-pulse" />
            )}
          </motion.div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-3">{station.name}</h2>
          {station.description && <p className="text-xl text-gray-400">{station.description}</p>}
          {isPlaying && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <span className="text-lg font-semibold text-white">EN VIVO</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={togglePlay}
              disabled={isLoading}
              size="icon"
              className="w-24 h-24 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-2xl shadow-fuchsia-500/50 transition-all"
            >
              {isLoading ? (
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-12 h-12" fill="white" />
              ) : (
                <Play className="w-12 h-12 ml-1" fill="white" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 px-4">
            <Button onClick={toggleMute} variant="ghost" size="icon" className="w-12 h-12 rounded-full text-white hover:bg-white/10">
              {volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>
            <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
            <span className="text-white font-semibold w-12 text-right">{volume}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
