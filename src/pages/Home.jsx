
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio, Volume2 } from 'lucide-react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [promoIndex, setPromoIndex] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (audioRef.current.paused) { audioRef.current.play(); setIsPlaying(true); } 
    else { audioRef.current.pause(); setIsPlaying(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#020205] text-white selection:bg-red-500/30">
      {/* FONDO CINEMATOGRÁFICO DINÁMICO */}
      <div className="cinema-bg"></div>
      <div className="ambient-light"></div>

      <header className="py-8 z-10 animate-fade-in">
        <img src="/logos/logo.png" className="h-28 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" alt="Fabulosa Play" />
      </header>

      <main className="w-full max-w-6xl px-4 space-y-12 pb-24 z-10">
        {/* REPRODUCTOR DE TV PREMIUM */}
        <div className="group relative w-full max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] aspect-video">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>
          <iframe 
            src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/embed.html" 
            className="w-full h-full relative z-0" 
            frameBorder="0" 
            allowFullScreen
          ></iframe>
          <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/70">Fabulosa TV Live</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* REPRODUCTOR DE RADIO FUTURISTA */}
          <div className="flex flex-col items-center justify-center p-10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-[80px] rounded-full"></div>
             
             <h2 className="text-white/40 text-[10px] mb-12 tracking-[0.5em] font-black uppercase">Interfaz de Audio v2.0</h2>
             
             <div className="relative cursor-pointer z-10 group" onClick={togglePlay}>
                <div className={`w-56 h-56 rounded-full border border-white/10 flex items-center justify-center transition-all duration-1000 ${isPlaying ? 'shadow-[0_0_100px_rgba(255,0,0,0.2)] scale-105 border-red-600/50' : ''}`}>
                   <div className={`w-48 h-48 rounded-full border-2 border-white/5 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                      <Radio size={70} className={`transition-all duration-500 ${isPlaying ? 'text-red-600 scale-110' : 'text-white/20'}`} />
                   </div>
                </div>
                {!isPlaying && <Play size={50} fill="white" className="absolute inset-0 m-auto animate-pulse" />}
             </div>

             <div className="mt-12 flex items-center gap-8 bg-black/40 p-5 px-8 rounded-full border border-white/5 z-10 backdrop-blur-md">
                <button onClick={togglePlay} className="text-white hover:text-red-500 transition-transform active:scale-90">
                   {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" />}
                </button>
                <div className="flex items-center gap-4">
                   <Volume2 size={20} className="text-white/30" />
                   <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {
                     const v = parseFloat(e.target.value); setVolume(v); audioRef.current.volume = v;
                   }} className="w-28 accent-red-600 cursor-pointer bg-white/10 h-1 rounded-full appearance-none" />
                </div>
             </div>
             <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
          </div>

          {/* CHAT WHATSAPP PRO INTEGRADO */}
          <div className="h-[600px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0b141a]">
             <ChatLive />
          </div>
        </div>

        {/* PUBLICIDAD CINEMATOGRÁFICA */}
        <div className="w-full group">
           <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-black/20 aspect-[21/9] shadow-inner">
              <img 
                src={`/publicidad/promo${promoIndex}.jpg`} 
                alt="Fabulosa Promo" 
                className="w-full h-full object-contain transition-all duration-1000 group-hover:scale-105" 
                onError={(e) => {e.target.src = "/publicidad/promo1.jpg"}} 
              />
              <div className="absolute bottom-4 right-6 text-[9px] font-mono text-white/20 tracking-tighter">AD_SPACE_01</div>
           </div>
        </div>
      </main>
    </div>
  );
}