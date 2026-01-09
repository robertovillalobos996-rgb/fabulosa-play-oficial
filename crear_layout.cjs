const fs = require('fs');
const path = require('path');

console.log("🏗️  CONSTRUYENDO ESTRUCTURA (LAYOUT)...");

const layoutCode = `import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, MessageCircle, Tv, Film, Mic2 } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  // Menú de navegación
  const navItems = [
    { icon: <Home size={20} />, label: "Inicio", path: "/home" },
    { icon: <Radio size={20} />, label: "Radio", path: "/radio" },
    { icon: <MessageCircle size={20} />, label: "Chat", path: "/social" },
    { icon: <Tv size={20} />, label: "TV", path: "/channels" },
    // Puedes descomentar estos si los usas
    // { icon: <Film size={20} />, label: "Cine", path: "/videoclub" },
    // { icon: <Mic2 size={20} />, label: "Karaoke", path: "/karaoke" },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* --- MENÚ LATERAL (PC) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-black/40 border-r border-white/5 p-4 z-20">
        <div className="flex items-center gap-3 mb-8 px-2">
           <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-lg flex items-center justify-center font-bold">F</div>
           <span className="font-bold text-xl tracking-tight">Fabulosa<span className="text-fuchsia-500">Play</span></span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={\`flex items-center gap-3 px-4 py-3 rounded-xl transition-all \${
                location.pathname === item.path 
                ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-900/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
              }\`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-[#110515]">
        
        {/* Cabecera Móvil */}
        <header className="md:hidden flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/5 z-20">
           <span className="font-bold text-lg">{currentPageName || "Fabulosa Play"}</span>
           <div className="w-8 h-8 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-sm">FP</div>
        </header>

        {/* Aquí se carga la página (Chat, Radio, etc) */}
        <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-fuchsia-900/50">
           {children}
        </div>

        {/* --- MENÚ INFERIOR (MÓVIL) --- */}
        <nav className="md:hidden flex justify-around items-center p-2 bg-black/90 backdrop-blur-lg border-t border-white/10 z-30 pb-safe">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={\`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors \${
                 location.pathname === item.path ? "text-fuchsia-500" : "text-gray-500"
              }\`}
            >
              {React.cloneElement(item.icon, { size: 22 })}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}`;

try {
    const layoutPath = path.join('src', 'Layout.jsx');
    fs.writeFileSync(layoutPath, layoutCode);
    console.log("✅ ARCHIVO CREADO: src/Layout.jsx");
    console.log("👉 El error de 'Could not resolve ./Layout' ha sido solucionado.");
} catch (error) {
    console.error("❌ Error escribiendo el archivo:", error);
}