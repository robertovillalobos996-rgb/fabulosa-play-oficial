const fs = require('fs');
const path = require('path');

console.log("🛠️ INICIANDO RESTAURACIÓN TOTAL DESDE CMD...");

// 1. CSS PRO (Corregido sin el 'sss')
const cssPro = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-[#06060a] text-white overflow-x-hidden; font-family: 'Inter', sans-serif; }
}

.animate-heart-real { animation: heartbeat-real 1.3s infinite cubic-bezier(0.215, 0.61, 0.355, 1); }
@keyframes heartbeat-real {
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  42% { transform: scale(1.25); filter: drop-shadow(0 0 25px rgba(255, 0, 0, 0.8)); }
  70% { transform: scale(1); }
}

.logo-energy-glow { filter: drop-shadow(0 0 30px rgba(255, 0, 0, 0.5)); animation: energy-pulse 3s infinite ease-in-out; }
@keyframes energy-pulse {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bg-nebula-red {
  background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(40px);
}`;

// 2. HOME PRO (TV + Radio + Chat Lateral)
const homePro = `import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, X } from 'lucide-react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChat, setShowChat] = useState(true); 
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current.paused) { audioRef.current.play(); setIsPlaying(true); } 
    else { audioRef.current.pause(); setIsPlaying(false); }
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col font-sans relative">
      <header className="flex justify-center py-10 w-full px-4">
        <img src="/logos/logo.png" className="h-40 md:h-64 object-contain logo-energy-glow" />
      </header>

      <main className="flex-1 container mx-auto px-4 grid lg:grid-cols-12 gap-8 pb-12">
        <div className={showChat ? 'lg:col-span-9' : 'lg:col-span-12'}>
          <div className="bg-black rounded-[2.5rem] border border-red-900/40 overflow-hidden aspect-video mb-12 shadow-2xl">
            <video className="w-full h-full object-contain" controls autoPlay src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8"></video>
          </div>
          <div className="relative py-10 flex flex-col items-center">
            <div className={\`absolute w-[400px] h-[300px] bg-nebula-red transition-opacity \${isPlaying ? 'opacity-100' : 'opacity-20'}\`}></div>
            <h2 className="text-3xl mb-12 tracking-widest uppercase font-bold text-red-600">Radio Fabulosa Romántica</h2>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <img src="/logos/logo-fabulosa.png" className="w-40 h-40 object-contain" />
              <div className="relative cursor-pointer" onClick={togglePlay}>
                <Heart size={260} fill="#ff0000" className={isPlaying ? 'animate-heart-real' : 'opacity-50'} />
                {!isPlaying && <Play size={70} fill="white" className="absolute inset-0 m-auto" />}
              </div>
            </div>
            <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
          </div>
        </div>

        {showChat && (
          <div className="lg:col-span-3 h-[650px] bg-[#0c0c12] rounded-[2.5rem] border border-red-900/30 overflow-hidden relative shadow-2xl">
            <X size={20} className="absolute top-4 right-4 z-20 cursor-pointer text-gray-500" onClick={() => setShowChat(false)} />
            <ChatLive />
          </div>
        )}
      </main>
    </div>
  );
}`;

// 3. SOCIAL PRO (Stickers + Fotos + Admin)
const socialPro = `import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Smile, Paperclip } from 'lucide-react';

export default function Social() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(localStorage.getItem('chatUser') || "");
  const [isSet, setIsSet] = useState(!!localStorage.getItem('chatUser'));
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

  const upload = async (e) => {
    const file = e.target.files[0]; if(!file) return; setUploading(true);
    try {
      const r = ref(storage, "chat/" + Date.now() + "_" + file.name);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await addDoc(collection(db, "mensajes"), { text: "Foto", imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
    } catch(e){ alert("Error foto"); } setUploading(false);
  };

  const del = async (id) => {
    if(prompt("🔒 CLAVE ADMIN:") === "admin") await deleteDoc(doc(db, "mensajes", id));
  };

  if(!isSet) return <div className="h-full flex items-center justify-center p-6 bg-black"><div className="w-full text-center"><input className="p-3 bg-gray-900 rounded w-full mb-4 text-white text-center" placeholder="Tu Nombre" value={user} onChange={e=>setUser(e.target.value)}/><button onClick={()=>{if(user){localStorage.setItem('chatUser',user);setIsSet(true)}}} className="w-full bg-red-600 p-3 rounded font-bold">ENTRAR</button></div></div>;

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.name===user?'items-end':'items-start'}\`}>
            <span className="text-[10px] text-gray-500 mb-1">\${m.name}</span>
            <div onDoubleClick={()=>del(m.id)} className={\`p-3 rounded-xl max-w-[85%] cursor-pointer \${m.type==='sticker'?'bg-transparent text-5xl': m.name===user?'bg-red-600':'bg-gray-800'}\`}>
              {m.type==='image' ? <img src={m.imageUrl} className="max-w-full rounded shadow-lg"/> : m.text}
            </div>
          </div>
        ))}
        <div ref={dummy}/>
      </div>
      {showStickers && <div className="grid grid-cols-6 p-2 bg-gray-900 border-t border-white/10 absolute bottom-16 w-full z-50">{STICKERS.map(s=><button key={s} onClick={async ()=>{await addDoc(collection(db,"mensajes"),{text:s,type:'sticker',name:user,createdAt:serverTimestamp()});setShowStickers(false)}} className="text-2xl p-2 hover:bg-white/10 rounded">{s}</button>)}</div>}
      <form onSubmit={send} className="p-3 bg-gray-950 flex gap-2 items-center">
        <button type="button" onClick={()=>setShowStickers(!showStickers)} className="text-yellow-400 p-2"><Smile/></button>
        <button type="button" onClick={()=>fileRef.current.click()} className="text-blue-400 p-2"><Paperclip/></button>
        <input type="file" ref={fileRef} onChange={upload} hidden accept="image/*" />
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 bg-gray-900 p-2 rounded text-sm" placeholder="Mensaje..." />
        <button type="submit" className="bg-red-600 p-2 rounded">{uploading ? "..." : <Send size={18}/>}</button>
      </form>
    </div>
  );
}`;

// ESCRIBIR TODOS LOS ARCHIVOS
fs.writeFileSync(path.join('src', 'index.css'), cssPro);
fs.writeFileSync(path.join('src', 'pages', 'Home.jsx'), homePro);
fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), socialPro);
fs.writeFileSync(path.join('src', 'ChatLive.jsx'), 'import React from "react"; import Social from "./pages/Social"; export default function ChatLive() { return <div className="h-full w-full"><Social /></div>; }');

console.log("✅ SISTEMA RESTAURADO. TODO PRO.");