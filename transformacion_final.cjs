const fs = require('fs');
const path = require('path');

console.log("🚀 INICIANDO TRANSFORMACIÓN CINEMATOGRÁFICA Y FUNCIONAL...");

// 1. CSS - Efecto Estrella Fugaz y Estilos de Animación
const cssCustom = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-[#06060a] text-white overflow-x-hidden relative; font-family: 'Inter', sans-serif; }
}

/* Efecto Estrella Fugaz Estilo Cine */
.shooting-star {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 2px;
  background: linear-gradient(-45deg, #ffffff, rgba(0, 0, 255, 0));
  filter: drop-shadow(0 0 6px #ffffff);
  animation: tail 3000ms ease-in-out infinite, shooting 3000ms ease-in-out infinite;
  z-index: -1;
}

@keyframes tail {
  0% { width: 0; }
  30% { width: 100px; }
  100% { width: 0; }
}

@keyframes shooting {
  0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 1; }
  100% { transform: translateX(-1000px) translateY(1000px) rotate(45deg); opacity: 0; }
}

.animate-heart-real { animation: heartbeat-real 1.3s infinite cubic-bezier(0.215, 0.61, 0.355, 1); }
@keyframes heartbeat-real {
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  42% { transform: scale(1.25); filter: drop-shadow(0 0 25px rgba(255, 0, 0, 0.8)); }
  70% { transform: scale(1); }
}

.text-candy-perlado {
  background: linear-gradient(180deg, #ffffff 0%, #ff1a1a 45%, #660000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}`;

// 2. HOME - Estructura con Chat a la par, Carrusel 4s y Controles de Audio
const homeCode = `import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Download, Volume2 } from 'lucide-react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [promoIndex, setPromoIndex] = useState(1);
  const audioRef = useRef(null);

  // Carrusel de publicidad cada 4 segundos
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

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioRef.current.volume = val;
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Estrellas fugaces de fondo */}
      <div className="shooting-star" style={{top: '10%', left: '80%'}}></div>
      <div className="shooting-star" style={{top: '30%', left: '90%', animationDelay: '1s'}}></div>

      <header className="py-8"><img src="/logos/logo.png" className="h-32 md:h-48 object-contain" /></header>

      <main className="w-full max-w-6xl px-4 space-y-12">
        {/* Reproductor Video - Tamaño Actual */}
        <div className="w-full bg-black rounded-3xl border border-red-900/40 overflow-hidden aspect-video shadow-2xl">
          <video className="w-full h-full object-contain" controls autoPlay src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8"></video>
        </div>

        {/* Sección Radio + Chat (A la par) */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Radio */}
          <div className="flex flex-col items-center p-8 bg-black/40 rounded-3xl border border-white/5 relative">
             <h2 className="text-candy-perlado text-xl mb-6 tracking-widest uppercase">RADIO FABULOSA ROMÁNTICA</h2>
             <div className="relative cursor-pointer mb-6" onClick={togglePlay}>
                <Heart size={180} fill="#ff0000" className={isPlaying ? 'animate-heart-real' : 'opacity-40'} />
                {!isPlaying && <Play size={50} fill="white" className="absolute inset-0 m-auto" />}
             </div>
             {/* Controles: Play, Pausa y Volumen */}
             <div className="flex items-center gap-4 bg-gray-900/80 p-3 rounded-full border border-white/10">
                <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                   {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex items-center gap-2">
                   <Volume2 size={20} className="text-gray-400" />
                   <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-24 accent-red-600 h-1" />
                </div>
             </div>
             <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
          </div>

          {/* Chat WhatsApp Style */}
          <div className="h-[500px] w-full bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
             <ChatLive />
          </div>
        </div>

        {/* Carrusel Publicidad - 4 Segundos */}
        <div className="w-full py-8 border-t border-white/5">
           <h3 className="text-center text-gray-500 text-xs tracking-widest mb-6 uppercase">Espacio Publicitario</h3>
           <a href={\`/publicidad/promo\${promoIndex}.jpg\`} target="_blank" rel="noopener noreferrer" className="block w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-colors">
              <img 
                src={\`/publicidad/promo\${promoIndex}.jpg\`} 
                alt="Publicidad" 
                className="w-full h-full object-contain bg-black"
                onError={(e) => {e.target.src = "/publicidad/promo1.jpg"}}
              />
           </a>
        </div>
      </main>

      <footer className="py-8 text-gray-600 text-[10px] tracking-[0.3em]">
        © 2026 FABULOSA PLAY - TODOS LOS DERECHOS RESERVADOS
      </footer>
    </div>
  );
}`;

// 3. SOCIAL - Estilo WhatsApp con Clave 1979
const socialCode = `import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Smile, Paperclip, Camera, Image as ImageIcon } from 'lucide-react';

export default function Social() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(localStorage.getItem('chatUser') || "");
  const [isSet, setIsSet] = useState(!!localStorage.getItem('chatUser'));
  const [showMenu, setShowMenu] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dummy = useRef();
  const fileRef = useRef();
  const STICKERS = ["😎","😍","🤣","😱","😡","😭","🥳","👻","👍","👎","🔥","❤️"];

  useEffect(() => {
    const q = query(collection(db, "mensajes"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (s) => {
      setMessages(s.docs.map(d => ({ ...d.data(), id: d.id })));
      setTimeout(() => dummy.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
  }, []);

  const send = async (e) => {
    e.preventDefault(); if(!text.trim()) return;
    await addDoc(collection(db, "mensajes"), { text, type: 'text', name: user, createdAt: serverTimestamp() });
    setText(""); 
  };

  const upload = async (e, mode) => {
    const file = e.target.files[0]; if(!file) return; setUploading(true);
    try {
      const r = ref(storage, "chat/" + Date.now() + "_" + file.name);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await addDoc(collection(db, "mensajes"), { text: mode === 'cam' ? "Fotografía" : "Imagen", imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
    } catch(e){ alert("Error"); }
    setUploading(false); setShowMenu(false);
  };

  const del = async (id) => {
    const pwd = prompt("Clave de Seguridad para borrar:");
    if(pwd === "1979") await deleteDoc(doc(db, "mensajes", id));
  };

  if(!isSet) return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-[#075e54]">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
         <h2 className="text-gray-800 font-bold text-center mb-4">Chat en vivo: Saludos y Complacencias</h2>
         <input className="p-3 bg-gray-100 rounded-xl w-full mb-4 text-black text-center" placeholder="Escribe tu nombre..." onChange={e=>setUser(e.target.value)} />
         <button onClick={()=>{if(user){localStorage.setItem('chatUser',user);setIsSet(true)}}} className="w-full bg-[#25d366] text-white p-3 rounded-xl font-bold uppercase">Entrar</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5] relative">
      <div className="bg-[#075e54] p-3 flex items-center justify-between text-white shadow-md">
         <span className="font-bold text-sm">Chat en vivo: Saludos y Complacencias</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.name===user?'items-end':'items-start'}\`}>
            <div onDoubleClick={()=>del(m.id)} className={\`p-2 px-3 rounded-xl max-w-[85%] shadow-sm \${m.name===user?'bg-[#dcf8c6] text-black':'bg-white text-black'}\`}>
              <span className="text-[9px] font-bold text-gray-500 block">\${m.name}</span>
              {m.type==='image' ? <img src={m.imageUrl} className="max-w-[200px] rounded-lg mt-1" /> : <span className="text-sm font-medium">\${m.text}</span>}
            </div>
          </div>
        ))}
        <div ref={dummy}/>
      </div>

      {showStickers && (
        <div className="absolute bottom-16 bg-white w-full grid grid-cols-6 p-2 gap-2 border-t border-gray-200 z-50">
          {STICKERS.map(s => <button key={s} onClick={async ()=>{await addDoc(collection(db,"mensajes"),{text:s,type:'text',name:user,createdAt:serverTimestamp()});setShowStickers(false)}} className="text-2xl hover:bg-gray-100 p-1 rounded">{s}</button>)}
        </div>
      )}

      {showMenu && (
        <div className="absolute bottom-16 left-2 bg-white rounded-2xl shadow-2xl p-4 flex gap-6 z-50 animate-bounce">
           <button onClick={()=>fileRef.current.click()} className="flex flex-col items-center text-purple-600"><div className="bg-purple-100 p-3 rounded-full mb-1"><ImageIcon size={24}/></div><span className="text-[10px]">Galería</span></button>
           <button className="flex flex-col items-center text-red-600"><div className="bg-red-100 p-3 rounded-full mb-1"><Camera size={24}/></div><span className="text-[10px]">Cámara</span></button>
        </div>
      )}

      <form onSubmit={send} className="p-2 bg-[#f0f0f0] flex gap-2 items-center">
        <button type="button" onClick={()=>setShowStickers(!showStickers)} className="text-gray-500"><Smile/></button>
        <button type="button" onClick={()=>setShowMenu(!showMenu)} className="text-gray-500"><Paperclip/></button>
        <input type="file" hidden ref={fileRef} onChange={(e)=>upload(e,'gal')} accept="image/*" />
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 bg-white p-2 px-4 rounded-full text-black text-sm outline-none" placeholder="Escribe un mensaje..." />
        <button type="submit" className="bg-[#075e54] p-2 rounded-full text-white shadow-md"><Send size={18}/></button>
      </form>
    </div>
  );
}`;

// Escribir archivos
fs.writeFileSync(path.join('src', 'index.css'), cssCustom);
fs.writeFileSync(path.join('src', 'pages', 'Home.jsx'), homeCode);
fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), socialCode);

console.log("✅ TRANSFORMACIÓN COMPLETADA: Chat WhatsApp, Clave 1979, Carrusel 4s y Estrella Fugaz activados.");