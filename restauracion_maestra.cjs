const fs = require('fs');
const path = require('path');

console.log("🎬 INICIANDO RESTAURACIÓN CINEMATOGRÁFICA PRO...");

// 1. CSS - EFECTOS DE CINE Y ESTRELLAS FUGACES
const cssCode = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-[#020205] text-white overflow-x-hidden relative; font-family: 'Inter', sans-serif; }
}

.cinema-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 50%, #1a0520 0%, #020205 100%);
  z-index: -2;
}

.shooting-star {
  position: absolute; width: 150px; height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
  animation: shoot 4s linear infinite; opacity: 0; z-index: -1;
}

@keyframes shoot {
  0% { transform: translateX(100vw) translateY(0) rotate(-35deg); opacity: 0; }
  10% { opacity: 1; }
  30% { transform: translateX(-100vw) translateY(100vh) rotate(-35deg); opacity: 0; }
  100% { opacity: 0; }
}

.animate-heart-real { animation: heartbeat-real 1.3s infinite cubic-bezier(0.215, 0.61, 0.355, 1); }
@keyframes heartbeat-real {
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  42% { transform: scale(1.25); filter: drop-shadow(0 0 25px rgba(255,0,0,0.8)); }
  70% { transform: scale(1); }
}

.text-candy-perlado {
  background: linear-gradient(180deg, #ffffff 0%, #ff1a1a 45%, #660000 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900;
}`;

// 2. HOME - RADIO SURREALISTA Y CARRUSEL 4S
const homeCode = `import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Volume2 } from 'lucide-react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [promoIndex, setPromoIndex] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev >= 100 ? 1 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (audioRef.current.paused) { audioRef.current.play(); setIsPlaying(true); } 
    else { audioRef.current.pause(); setIsPlaying(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="cinema-bg"></div>
      <div className="shooting-star" style={{top: '10%', animationDelay: '0s'}}></div>
      <div className="shooting-star" style={{top: '40%', animationDelay: '2s'}}></div>

      <header className="py-8"><img src="/logos/logo.png" className="h-32 md:h-48 object-contain" /></header>

      <main className="w-full max-w-7xl px-4 space-y-12 pb-20">
        <div className="w-full bg-black rounded-[2rem] border-2 border-white/5 overflow-hidden aspect-video shadow-2xl relative">
          <video className="w-full h-full object-contain" controls autoPlay playsInline src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8"></video>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="flex flex-col items-center justify-center p-10 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 relative overflow-hidden min-h-[550px]">
             <h2 className="text-candy-perlado text-3xl mb-10 tracking-widest uppercase text-center">FABULOSA FM</h2>
             <div className="relative cursor-pointer z-10" onClick={togglePlay}>
                <Heart size={240} fill="#ff0000" className={isPlaying ? 'animate-heart-real' : 'opacity-40'} />
                {!isPlaying && <Play size={80} fill="white" className="absolute inset-0 m-auto" />}
             </div>
             <div className="mt-12 flex items-center gap-6 bg-black/60 p-4 px-8 rounded-full border border-white/20 z-10">
                <button onClick={togglePlay} className="text-white hover:text-red-500">
                   {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <div className="flex items-center gap-4">
                   <Volume2 size={24} className="text-gray-400" />
                   <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => {
                     const v = parseFloat(e.target.value); setVolume(v); audioRef.current.volume = v;
                   }} className="w-32 accent-red-600" />
                </div>
             </div>
             <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
          </div>

          <div className="h-[550px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0b141a]">
             <ChatLive />
          </div>
        </div>

        <div className="w-full pt-10">
           <a href={\`/publicidad/promo\${promoIndex}.jpg\`} target="_blank" rel="noopener noreferrer" className="block w-full rounded-3xl overflow-hidden border border-white/10 bg-black">
              <img src={\`/publicidad/promo\${promoIndex}.jpg\`} alt="Promo" className="w-full h-[350px] object-contain" onError={(e) => {e.target.src = "/publicidad/promo1.jpg"}} />
           </a>
        </div>
      </main>
    </div>
  );
}`;

// 3. SOCIAL - WHATSAPP CLONE CON CLAVE 1979
const socialCode = `import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Smile, Paperclip, ImageIcon, X } from 'lucide-react';

export default function Social() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(localStorage.getItem('chatUser') || "");
  const [isSet, setIsSet] = useState(!!localStorage.getItem('chatUser'));
  const [uploading, setUploading] = useState(false);
  const dummy = useRef();
  const fileRef = useRef();

  useEffect(() => {
    const q = query(collection(db, "mensajes"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (s) => {
      setMessages(s.docs.map(d => ({ ...d.data(), id: d.id })));
      setTimeout(() => dummy.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; setUploading(true);
    try {
      const storageRef = ref(storage, \`chat/\${Date.now()}_\${file.name}\`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "mensajes"), { imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
    } catch (err) { alert("Error"); } setUploading(false);
  };

  const del = async (id) => {
    if(prompt("Clave Admin:") === "1979") await deleteDoc(doc(db, "mensajes", id));
  };

  if(!isSet) return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-[#111b21]">
      <div className="w-full max-w-xs bg-[#202c33] p-8 rounded-3xl border border-white/5 shadow-2xl">
        <h3 className="text-white font-bold text-center mb-6 uppercase tracking-widest">Registra tu Nombre</h3>
        <input className="w-full p-4 bg-[#2a3942] rounded-2xl text-white outline-none mb-6 text-center" placeholder="..." onChange={e => setUser(e.target.value)} />
        <button onClick={() => { if(user.trim()) { localStorage.setItem('chatUser', user); setIsSet(true); }}} className="w-full bg-[#00a884] text-[#111b21] p-4 rounded-2xl font-black">ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0b141a] relative">
      <div className="bg-[#202c33] p-4 text-white border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold">F</div>
        <div><p className="text-sm font-bold leading-none">Chat en Vivo</p><p className="text-[10px] text-[#00a884]">Saludos y Complacencias</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-80">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.name === user ? 'items-end' : 'items-start'}\`}>
            <div onDoubleClick={() => del(m.id)} className={\`p-2 px-4 rounded-xl max-w-[85%] shadow-lg \${m.name === user ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-white'}\`}>
              <p className="text-[10px] font-black text-red-400 mb-1">\${m.name}</p>
              {m.imageUrl ? <img src={m.imageUrl} className="rounded-lg max-w-full" /> : <p className="text-sm">\${m.text}</p>}
            </div>
          </div>
        ))}
        <div ref={dummy} />
      </div>
      <form onSubmit={async (e) => { e.preventDefault(); if(!text.trim()) return; await addDoc(collection(db, "mensajes"), { text, type: 'text', name: user, createdAt: serverTimestamp() }); setText(""); }} className="p-3 bg-[#202c33] flex gap-3 items-center">
        <button type="button" onClick={() => fileRef.current.click()} className="text-[#8696a0]"><Paperclip /></button>
        <input type="file" ref={fileRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 bg-[#2a3942] p-3 rounded-xl text-white text-sm outline-none" placeholder="Escribe..." />
        <button type="submit" className="bg-[#00a884] p-3 rounded-full text-[#111b21]"><Send size={20}/></button>
      </form>
    </div>
  );
}`;

fs.writeFileSync(path.join('src', 'index.css'), cssCode);
fs.writeFileSync(path.join('src', 'pages', 'Home.jsx'), homeCode);
fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), socialCode);
fs.writeFileSync(path.join('src', 'ChatLive.jsx'), 'import React from "react"; import Social from "./pages/Social"; export default function ChatLive() { return <div className="h-full w-full"><Social /></div>; }');

console.log("✅ ARCHIVOS GENERADOS CORRECTAMENTE.");