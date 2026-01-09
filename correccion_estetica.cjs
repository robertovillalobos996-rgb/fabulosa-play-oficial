const fs = require('fs');
const path = require('path');

console.log("🛠️ RESTAURANDO DISEÑO ORIGINAL (SIN MENÚ LATERAL)...");

// 1. APP.JSX - Limpiamos las rutas para eliminar el Layout con menú
const appOriginal = `import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./pages/Home";
import Social from "./pages/Social";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/social" element={<Social />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}`;

// 2. HOME.JSX - Diseño Pro de ancho completo con publicidad y pie de página
const homeOriginal = `import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, Download } from 'lucide-react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current.paused) { audioRef.current.play(); setIsPlaying(true); } 
    else { audioRef.current.pause(); setIsPlaying(false); }
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col font-sans overflow-x-hidden">
      {/* Botón de Descarga Original */}
      <div className="fixed top-6 right-6 z-50">
        <button className="bg-red-600 hover:bg-red-700 p-3 rounded-full shadow-lg transition-transform hover:scale-110">
          <Download size={24} />
        </button>
      </div>

      <header className="flex justify-center py-8 w-full">
        <img src="/logos/logo.png" className="h-32 md:h-48 object-contain logo-energy-glow" alt="Fabulosa Play" />
      </header>

      <main className="flex-1 container mx-auto px-4 flex flex-col items-center">
        {/* TV - Ancho Pro */}
        <div className="w-full max-w-4xl bg-black rounded-3xl border border-red-900/40 overflow-hidden aspect-video shadow-2xl mb-8">
          <video className="w-full h-full object-contain" controls autoPlay playsInline src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8"></video>
        </div>

        {/* Publicidad / Banner */}
        <div className="w-full max-w-4xl mb-12 bg-gray-900/50 p-4 rounded-xl border border-white/5 text-center italic text-gray-500">
          Espacio Publicitario
        </div>

        {/* Radio Sección */}
        <div className="flex flex-col items-center mb-12 relative">
          <div className="absolute w-64 h-64 bg-red-600/20 blur-3xl rounded-full"></div>
          <h2 className="text-candy-perlado text-2xl md:text-3xl mb-8 tracking-widest uppercase font-black">RADIO FABULOSA ROMÁNTICA</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <img src="/logos/logo-fabulosa.png" className="w-32 h-32 object-contain" />
            <div className="relative cursor-pointer" onClick={togglePlay}>
              <Heart size={200} fill="#ff0000" className={isPlaying ? 'animate-heart-real' : 'opacity-40'} />
              {!isPlaying && <Play size={60} fill="white" className="absolute inset-0 m-auto" />}
            </div>
          </div>
          <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
        </div>

        {/* Botón Chat VIP Integrado */}
        <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-white/10 mb-12 text-center shadow-xl">
           <p className="text-yellow-400 font-bold mb-4">¿Buscas el Chat?</p>
           <a href="/social" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/40">
              IR AL CHAT VIP
           </a>
        </div>
      </main>

      {/* Derechos Reservados Pie de Página */}
      <footer className="py-8 bg-black/80 border-t border-white/5 text-center">
        <p className="text-gray-600 text-xs tracking-widest">
          © 2026 FABULOSA PLAY - TODOS LOS DERECHOS RESERVADOS
        </p>
      </footer>
    </div>
  );
}`;

// Escribir archivos de restauración
fs.writeFileSync(path.join('src', 'App.jsx'), appOriginal);
fs.writeFileSync(path.join('src', 'pages', 'Home.jsx'), homeOriginal);

console.log("✅ DISEÑO ORIGINAL RESTAURADO. SIN MENÚS EXTRAS.");