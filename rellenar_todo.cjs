const fs = require('fs');
const path = require('path');

console.log("👷‍♂️ REVISANDO Y CREANDO ARCHIVOS FALTANTES...");

const pagesDir = path.join('src', 'pages');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

// --- 1. RADIO (Esencial para ti) ---
const radioCode = `import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, Radio as RadioIcon } from "lucide-react";
import { fabulosaData } from "../data/fabulosaData";

export default function Radio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const radio = fabulosaData.radios?.[0] || { name: "Fabulosa FM", url: "https://s2.radio.co/s21a0b5f12/listen" };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-black/50">
      <div className="w-48 h-48 bg-gradient-to-br from-fuchsia-600 to-purple-800 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(192,38,211,0.4)] animate-pulse">
        <RadioIcon size={80} className="text-white" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">{radio.name}</h1>
      <p className="text-fuchsia-400 mb-8 uppercase tracking-widest text-sm">En Vivo • Panamá</p>
      
      <audio ref={audioRef} src={radio.url} />
      
      <button onClick={togglePlay} className="p-6 bg-white rounded-full hover:scale-110 transition-transform shadow-xl">
        {isPlaying ? <Pause size={40} className="text-black" /> : <Play size={40} className="text-black ml-1" />}
      </button>
    </div>
  );
}`;

// --- 2. KARAOKE (Placeholder para que no falle) ---
const karaokeCode = `import React from "react";
import { Mic2 } from "lucide-react";

export default function Karaoke() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <Mic2 size={64} className="mb-4 opacity-50" />
      <h2 className="text-2xl text-white font-bold">Karaoke</h2>
      <p>Próximamente disponible en la versión Web.</p>
    </div>
  );
}`;

// --- 3. LAYOUT (El menú, por si acaso) ---
const layoutCode = `import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, MessageCircle, Tv } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navItems = [
    { icon: <Home size={20} />, label: "Inicio", path: "/home" },
    { icon: <Radio size={20} />, label: "Radio", path: "/radio" },
    { icon: <MessageCircle size={20} />, label: "Chat", path: "/social" },
    { icon: <Tv size={20} />, label: "TV", path: "/channels" }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-black/40 border-r border-white/5 p-4">
        <div className="flex items-center gap-2 mb-8 text-xl font-bold">
           <div className="w-8 h-8 bg-fuchsia-600 rounded flex items-center justify-center">F</div>
           <span>Fabulosa</span>
        </div>
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={\`flex items-center gap-3 px-4 py-3 rounded-xl \${location.pathname === item.path ? "bg-white/10 text-white" : "text-gray-400"}\`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col relative">
         <div className="flex-1 overflow-y-auto">{children}</div>
         <nav className="md:hidden flex justify-around p-3 bg-black border-t border-white/10">
           {navItems.map(item => (
             <Link key={item.path} to={item.path} className={\`flex flex-col items-center p-2 \${location.pathname === item.path ? "text-fuchsia-500" : "text-gray-500"}\`}>
               {item.icon} <span className="text-[10px] mt-1">{item.label}</span>
             </Link>
           ))}
         </nav>
      </main>
    </div>
  );
}`;

// FUNCIÓN PARA CREAR SI NO EXISTE
function createifMissing(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Creado: ${filePath}`);
    } else {
        console.log(`👌 Ya existe: ${filePath} (No se tocó)`);
    }
}

try {
    createifMissing(path.join(pagesDir, 'Radio.jsx'), radioCode);
    createifMissing(path.join(pagesDir, 'Karaoke.jsx'), karaokeCode);
    createifMissing(path.join('src', 'Layout.jsx'), layoutCode);
    
    console.log("\n🚀 ¡Archivos completados! Ahora Vercel encontrará todo.");
} catch (error) {
    console.error("❌ Error:", error);
}