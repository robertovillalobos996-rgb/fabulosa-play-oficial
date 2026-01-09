const fs = require('fs');
const path = require('path');

console.log("🚑 APLICANDO ELECTROSHOCK A LA PÁGINA...");

// --- 1. APP.JSX (Cerebro de Rutas) ---
const appCode = `import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Layout from "./Layout"; 
import Home from "./pages/Home";
import Social from "./pages/Social";
import Radio from "./pages/Radio";
import Channels from "./pages/Channels";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/social" element={<Layout><Social /></Layout>} />
      <Route path="/radio" element={<Layout><Radio /></Layout>} />
      <Route path="/channels" element={<Layout><Channels /></Layout>} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}`;

fs.writeFileSync(path.join('src', 'App.jsx'), appCode);
console.log("✅ App.jsx reconstruido.");

// --- 2. HOME.JSX (Modo Seguro - Sin Chat por ahora) ---
const homeCode = `import React, { useState, useRef } from 'react';
import { Play, Pause, Heart } from 'lucide-react';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 font-sans">
      <header className="py-8"><h1 className="text-3xl font-bold text-red-600">Fabulosa Play</h1></header>

      <main className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* TV */}
        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-red-900/50 aspect-video relative">
            <div className="absolute top-2 left-4 text-xs font-bold bg-red-600 px-2 py-1 rounded text-white z-10">EN VIVO</div>
            <video className="w-full h-full object-cover" controls playsInline src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8"></video>
        </div>

        {/* RADIO */}
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-3xl border border-white/10">
            <div onClick={togglePlay} className="relative cursor-pointer hover:scale-105 transition-transform mb-6">
               <Heart size={100} className={\`text-red-600 \${isPlaying ? 'animate-pulse' : ''}\`} />
               {!isPlaying && <Play size={40} className="absolute inset-0 m-auto text-white"/>}
            </div>
            <h2 className="text-2xl font-bold mb-2">Fabulosa Estéreo</h2>
            <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
            <button onClick={togglePlay} className="bg-red-600 px-6 py-2 rounded-full font-bold mt-4">
               {isPlaying ? "PAUSA" : "PLAY"}
            </button>
        </div>
      </main>
      
      <div className="mt-8 p-4 bg-gray-800 rounded-xl text-center w-full max-w-md">
        <p className="text-yellow-400 font-bold mb-2">¿Buscas el Chat?</p>
        <p className="text-sm text-gray-300 mb-2">Está en su propia pestaña para ser más rápido.</p>
        <a href="/social" className="inline-block bg-blue-600 px-4 py-2 rounded-lg text-white font-bold">IR AL CHAT VIP</a>
      </div>
    </div>
  );
}`;

fs.writeFileSync(path.join('src', 'pages', 'Home.jsx'), homeCode);
console.log("✅ Home.jsx restaurado.");
console.log("👉 Ejecuta 'vercel --prod --force' y la web volverá.");