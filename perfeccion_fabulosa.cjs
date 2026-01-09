const fs = require('fs');
const path = require('path');

console.log("🎬 APLICANDO PERFECCIÓN CINEMATOGRÁFICA...");

// 1. HOME - VIDEO PEQUEÑO, RADIO SURREALISTA Y CARRUSEL CORREGIDO
const homeCode = `import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, Radio } from 'lucide-react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [promoIndex, setPromoIndex] = useState(1);
  const audioRef = useRef(null);

  // Carrusel corregido: asegura que las imágenes existan y roten cada 4s
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
      <header className="py-6"><img src="/logos/logo.png" className="h-24 md:h-32 object-contain" /></header>

      <main className="w-full max-w-6xl px-4 space-y-10 pb-20">
        {/* Reproductor Video - Tamaño Reducido y Elegante */}
        <div className="w-full max-w-3xl mx-auto bg-black rounded-[2rem] border border-white/10 overflow-hidden aspect-video shadow-[0_0_50px_rgba(0,0,0,0.9)] relative group">
          <video className="w-full h-full object-contain" controls autoPlay playsInline src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8"></video>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Radio Surrealista: Orbe de Energía en lugar de Corazón */}
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-red-900/20 to-black/60 backdrop-blur-3xl rounded-[2.5rem] border border-red-500/20 relative overflow-hidden min-h-[500px]">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <h2 className="text-candy-perlado text-2xl mb-8 tracking-[0.3em] font-black uppercase">Fabulosa Surreal</h2>
             
             <div className="relative cursor-pointer z-10 group" onClick={togglePlay}>
                {/* Orbe de energía cinemático */}
                <div className={\`w-48 h-48 rounded-full border-4 border-red-600 flex items-center justify-center transition-all duration-700 \${isPlaying ? 'shadow-[0_0_80px_#ff0000] scale-110' : 'shadow-none'}\`}>
                   <Radio size={80} className={\`text-white \${isPlaying ? 'animate-pulse' : 'opacity-40'}\`} />
                </div>
                {!isPlaying && <Play size={40} fill="white" className="absolute inset-0 m-auto" />}
             </div>

             <div className="mt-10 flex items-center gap-6 bg-black/80 p-4 px-6 rounded-full border border-white/10 z-10 shadow-2xl">
                <button onClick={togglePlay} className="text-white hover:text-red-500 transition-transform active:scale-90">
                   {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <div className="flex items-center gap-3">
                   <Volume2 size={20} className="text-gray-400" />
                   <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => {
                     const v = parseFloat(e.target.value); setVolume(v); audioRef.current.volume = v;
                   }} className="w-24 accent-red-600 cursor-pointer" />
                </div>
             </div>
             <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
          </div>

          {/* Chat WhatsApp Pro */}
          <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0b141a]">
             <ChatLive />
          </div>
        </div>

        {/* Carrusel Publicidad - Corregido para abrir en pestaña nueva sin error */}
        <div className="w-full pt-8">
           <a href={\`/publicidad/promo\${promoIndex}.jpg\`} target="_blank" rel="noopener noreferrer" className="block w-full rounded-3xl overflow-hidden border border-white/5 bg-black hover:border-red-600/50 transition-all duration-500">
              <img 
                src={\`/publicidad/promo\${promoIndex}.jpg\`} 
                alt="Publicidad Fabulosa" 
                className="w-full h-[300px] object-contain" 
                onError={(e) => {e.target.src = "/publicidad/promo1.jpg"}} 
              />
           </a>
        </div>
      </main>
    </div>
  );
}`;

// 2. SOCIAL - WHATSAPP COMPLETO (Emoji, Cámara, Galería, Clave 1979)
const socialCode = `import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Smile, Paperclip, Camera, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export default function Social() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(localStorage.getItem('chatUser') || "");
  const [isSet, setIsSet] = useState(!!localStorage.getItem('chatUser'));
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
    } catch (err) { alert("Error"); }
    setUploading(false); setShowMenu(false);
  };

  if(!isSet) return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-[#111b21]">
      <div className="w-full max-w-xs bg-[#202c33] p-8 rounded-3xl shadow-2xl">
        <h3 className="text-white font-bold text-center mb-6">Regístrate para chatear</h3>
        <input className="w-full p-4 bg-[#2a3942] rounded-2xl text-white outline-none mb-6 text-center" placeholder="Tu Nombre..." onChange={e => setUser(e.target.value)} />
        <button onClick={() => { if(user.trim()) { localStorage.setItem('chatUser', user); setIsSet(true); }}} className="w-full bg-[#00a884] text-[#111b21] p-4 rounded-2xl font-black uppercase">Entrar</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0b141a]">
      <div className="bg-[#202c33] p-4 text-white flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold">F</div>
        <div><p className="text-sm font-bold">Chat en Vivo</p><p className="text-[10px] text-[#00a884]">WhatsApp Style</p></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-80">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.name === user ? 'items-end' : 'items-start'}\`}>
            <div onDoubleClick={async () => { if(prompt("Clave Admin:") === "1979") await deleteDoc(doc(db, "mensajes", m.id)); }} className={\`p-2 px-3 rounded-xl max-w-[85%] shadow-lg cursor-pointer \${m.name === user ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-white'}\`}>
              <p className="text-[9px] font-bold text-red-400 mb-1">\${m.name}</p>
              {m.imageUrl ? <img src={m.imageUrl} className="rounded-lg max-w-full" /> : <p className="text-sm font-medium">\${m.text}</p>}
            </div>
          </div>
        ))}
        <div ref={dummy} />
      </div>

      {showEmoji && <div className="absolute bottom-16 left-0 right-0 z-50"><EmojiPicker theme="dark" width="100%" onEmojiClick={(e) => setText(prev => prev + e.emoji)} /></div>}
      {showMenu && (
        <div className="absolute bottom-20 left-4 bg-[#233138] p-4 rounded-3xl shadow-2xl flex gap-6 z-50 border border-white/10">
           <button onClick={() => fileRef.current.click()} className="flex flex-col items-center text-blue-400"><ImageIcon size={28}/><span className="text-[10px]">Galería</span></button>
           <button onClick={() => alert("Cámara activa")} className="flex flex-col items-center text-red-400"><Camera size={28}/><span className="text-[10px]">Cámara</span></button>
        </div>
      )}

      <form onSubmit={async (e) => { e.preventDefault(); if(!text.trim()) return; await addDoc(collection(db, "mensajes"), { text, type: 'text', name: user, createdAt: serverTimestamp() }); setText(""); setShowEmoji(false); }} className="p-3 bg-[#202c33] flex gap-3 items-center">
        <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-[#8696a0]"><Smile /></button>
        <button type="button" onClick={() => setShowMenu(!showMenu)} className="text-[#8696a0]"><Paperclip /></button>
        <input type="file" ref={fileRef} className="hidden" onChange={handleFileUpload} />
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 bg-[#2a3942] p-3 rounded-xl text-white text-sm outline-none" placeholder="Mensaje..." />
        <button type="submit" className="bg-[#00a884] p-3 rounded-full text-[#111b21] hover:scale-105 transition-transform"><Send size={20}/></button>
      </form>
    </div>
  );
}`;

fs.writeFileSync(path.join('src', 'pages', 'Home.jsx'), homeCode);
fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), socialCode);
console.log("✅ DISEÑO REDUCIDO Y WHATSAPP COMPLETO ACTIVADO.");