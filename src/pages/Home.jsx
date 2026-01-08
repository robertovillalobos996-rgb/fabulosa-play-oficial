import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Cast, Maximize, Heart, X, Download } from 'lucide-react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showChat, setShowChat] = useState(true); 
  const audioRef = useRef(null);

  // Configuración de Publicidad
  const ads = [
    { id: 1, url: '/publicidad/promo1.jpg' }, 
    { id: 2, url: '/publicidad/promo2.jpg' }, 
    { id: 3, url: '/publicidad/promo3.jpg' }
  ];
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentAd((p) => (p + 1) % ads.length), 5000);
    return () => clearInterval(timer);
  }, [ads.length]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col overflow-x-hidden relative font-sans">
      
      {/* BOTÓN DESCARGA 3D */}
      <div className="fixed top-6 right-6 z-50">
        <button className="btn-download-3d flex items-center gap-2 px-6 py-3 rounded-xl font-black italic tracking-tighter hover:scale-105 transition-transform">
          <Download size={22} strokeWidth={3} />
          <span className="hidden md:inline">DESCARGAR APP</span>
        </button>
      </div>

      {/* CABECERA */}
      <header className="flex justify-center py-10 w-full px-4">
        <div className="logo-energy-box relative group">
           <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-20 rounded-full"></div>
           <img src="/logos/logo.png" alt="Fabulosa Play" className="h-40 md:h-64 object-contain main-logo relative z-10" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 grid lg:grid-cols-12 gap-8 pb-12">
        
        {/* COLUMNA IZQUIERDA: TV Y RADIO */}
        <div className={`${showChat ? 'lg:col-span-9' : 'lg:col-span-12'} transition-all duration-500 space-y-12`}>
          
          {/* TV EN VIVO */}
          <div className="bg-black rounded-[2.5rem] border border-red-900/40 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] relative group">
            <div className="absolute top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center pointer-events-none">
              <h2 className="text-candy-perlado text-xl">Fabulosa TV</h2>
              <div className="flex gap-4"><Cast size={20} /><Maximize size={20} /></div>
            </div>
            <div className="aspect-video bg-[#0a0a0a]">
              <video className="w-full h-full object-contain" controls autoPlay playsInline src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8"></video>
            </div>
          </div>

          {/* --- RADIO FABULOSA SUPERNOVA (ESTILO DEFINITIVO) --- */}
          <div className="relative py-10 flex flex-col items-center justify-center">
            
            {/* FONDO NEBULOSA */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-nebula-red transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-20'}`}></div>

            <h2 className="text-candy-perlado text-3xl mb-12 tracking-widest text-center relative z-10 drop-shadow-lg">
              RADIO FABULOSA ROMÁNTICA
            </h2>
            
            {/* CONTENEDOR PRINCIPAL: LOGO IZQUIERDA - CORAZÓN DERECHA */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
              
              {/* 1. LOGO FLOTANTE (IZQUIERDA) */}
              <div className="relative group">
                 {/* Resplandor detrás del logo */}
                 <div className="absolute inset-0 bg-red-600 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                 <img 
                   src="/logos/logo-fabulosa.png" 
                   alt="Fabulosa Stereo" 
                   className="w-40 h-40 object-contain logo-energy-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                 />
              </div>

              {/* 2. CORAZÓN PURO (DERECHA/CENTRO) */}
              <div className="relative cursor-pointer group" onClick={togglePlay}>
                {/* Onda Expansiva */}
                <div className={`absolute inset-0 rounded-full ${isPlaying ? 'shockwave-effect' : ''}`}></div>
                
                {/* Icono del Corazón (SIN LOGO ADENTRO) */}
                <Heart 
                  size={260} 
                  fill="#ff0000" 
                  className={`text-[#500000] drop-shadow-[0_0_60px_rgba(255,0,0,0.6)] transition-all duration-300 ${isPlaying ? 'animate-heart-real' : 'opacity-50 grayscale-[0.3] scale-90'}`} 
                />

                {/* Icono Play Gigante (Solo si pausado) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <Play size={70} fill="white" className="opacity-90 drop-shadow-xl animate-pulse" />
                  </div>
                )}
              </div>

            </div>
            
            {/* Audio Invisible */}
            <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
            
            {/* CONTROLES DE CRISTAL (ABAJO) */}
            <div className="relative z-10 flex items-center gap-6 bg-black/40 backdrop-blur-md px-10 py-5 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-red-500/50 transition-colors mt-10">
              <button 
                className="hover:scale-110 transition-transform cursor-pointer bg-gradient-to-br from-red-600 to-red-900 p-4 rounded-full shadow-lg" 
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
              </button>
              
              <div className="flex items-center gap-3">
                <Volume2 size={24} className="text-gray-300" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume} 
                  onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); audioRef.current.volume = v; }} 
                  className="w-32 md:w-56 accent-red-600 cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none" 
                />
              </div>
            </div>

          </div>
          {/* --- FIN RADIO PRO --- */}

        </div>

        {/* COLUMNA DERECHA: CHAT Y PUBLICIDAD */}
        {showChat && (
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <div className="bg-[#0c0c12] rounded-[2.5rem] border border-red-900/30 flex flex-col h-[650px] shadow-2xl relative overflow-hidden">
               <div className="absolute top-4 right-4 z-20">
                  <X size={20} className="cursor-pointer text-gray-500 hover:text-white bg-black/50 rounded-full p-1" onClick={() => setShowChat(false)} />
               </div>
               <ChatLive />
            </div>

            <div className="aspect-square bg-black rounded-[2.5rem] border border-red-900/20 relative overflow-hidden shadow-2xl">
              {ads.map((ad, index) => (
                <img key={ad.id} src={ad.url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentAd ? 'opacity-100' : 'opacity-0'}`} alt="Publicidad" />
              ))}
              <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[9px] text-gray-400 border border-white/5 tracking-widest">PROMO</div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER CON MARCADOR ROJO PARA VERCEL */}
      <footer className="py-12 text-center border-t border-white/5 bg-black/80 mt-auto">
        <p className="text-red-500 text-[12px] tracking-[0.4em] uppercase font-bold animate-pulse">
          © Fabulosa Play 2026 • VERSIÓN 3.0 ACTUALIZADA
        </p>
      </footer>
    </div>
  );
}