import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X, SkipForward, SkipBack, Maximize } from 'lucide-react';
import { Button } from '../ui/button';

export default function VideoPlayer({ channel, onClose, onNextChannel, onPrevChannel }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [streamError, setStreamError] = useState(false);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && channel) {
      setStreamError(false);
      setIsLoading(true);
      
      // Validar stream_url antes de reproducir
      if (!channel.stream_url || typeof channel.stream_url !== 'string') {
        console.error('stream_url inválido:', channel.stream_url);
        setStreamError(true);
        setIsLoading(false);
        return;
      }
      
      videoRef.current.src = channel.stream_url;
      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.error('Error al reproducir:', error);
        setStreamError(true);
        setIsLoading(false);
      });
    }
  }, [channel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setStreamError(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      console.error('Error en el stream de video');
      setStreamError(true);
      setIsLoading(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error al entrar en pantalla completa:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {/* Video */}
      <div className="flex-1 relative flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
        />

        {/* Loading Spinner */}
        {isLoading && !streamError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Stream Error */}
        {streamError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center px-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-600/20 flex items-center justify-center">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Este canal no permite reproducción web
              </h3>
              <p className="text-lg text-gray-400">
                Disponible en app.
              </p>
            </div>
          </div>
        )}

        {/* Channel Info Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {(channel.logo || channel.logo_url) && (
                    <img 
                      src={channel.logo || channel.logo_url} 
                      alt={channel.name}
                      className="w-20 h-20 object-contain"
                      crossOrigin="anonymous"
                    />
                  )}
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {channel.name}
                    </h2>
                    {channel.category && (
                      <p className="text-lg text-gray-300">{channel.category}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-sm font-semibold text-white">EN VIVO</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent"
            >
              <div className="flex items-center justify-center gap-6">
                {/* Previous Channel */}
                {onPrevChannel && (
                  <Button
                    onClick={onPrevChannel}
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                )}

                {/* Play/Pause */}
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="icon"
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-2xl shadow-fuchsia-500/50"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10" fill="white" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" fill="white" />
                  )}
                </Button>

                {/* Next Channel */}
                {onNextChannel && (
                  <Button
                    onClick={onNextChannel}
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                )}

                {/* Mute */}
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white ml-4"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </Button>

                {/* Fullscreen */}
                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <Maximize className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
