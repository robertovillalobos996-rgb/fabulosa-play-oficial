const fs = require('fs');
const path = require('path');

console.log("🚀 RESTAURANDO VERSIÓN PRO (DISEÑO ORIGINAL + ADMIN)...");

// 1. ESTILOS PRO (Letras Candy, Latido Realista, Energía)
const cssPro = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-[#06060a] text-white overflow-x-hidden; font-family: 'Inter', sans-serif; }
}

@keyframes heartbeat-real {
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  42% { transform: scale(1.25); filter: drop-shadow(0 0 25px rgba(255, 0, 0, 0.8)); }
  70% { transform: scale(1); }
}
.animate-heart-real { animation: heartbeat-real 1.3s infinite cubic-bezier(0.215, 0.61, 0.355, 1); }

.logo-energy-glow {
  filter: drop-shadow(0 0 30px rgba(255, 0, 0, 0.5));
  animation: energy-pulse 3s infinite ease-in-out;
}
@keyframes energy-pulse {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.4)); transform: translateY(0); }
  50% { filter: drop-shadow(0 0 60px rgba(255, 0, 0, 0.8)); transform: translateY(-10px); }
}

.text-candy-perlado {
  background: linear-gradient(180deg, #ffffff 0%, #ff1a1a 45%, #660000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}

.btn-download-3d {
  background: linear-gradient(145deg, #ff1a1a, #800000);
  box-shadow: 0 8px 0 #4d0000, 0 15px 25px rgba(255, 0, 0, 0.4);
}

.bg-nebula-red {
  background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(40px);
}`;

// 2. HOME PRO (Logo Energía, Radio Supernova, TV)
const homePro = `import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, Download, X } from 'lucide-react';
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
      <div className="fixed top-6 right-6 z-50">
        <button className="btn-download-3d flex items-center gap-2 px-6 py-3 rounded-xl font-black italic">
          <Download size={22} /> <span>DESCARGAR APP</span>
        </button>
      </div>

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
            <h2 className="text-candy-perlado text-3xl mb-12 tracking-widest uppercase">Radio Fabulosa Romántica</h2>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <img src="/logos/logo-fabulosa.png" className="w-40 h-40 object-contain logo-energy-glow" />
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

// 3. CHAT VIP (Stickers, Fotos, Borrado Admin)
const socialPro = `import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Smile, Paperclip, Sparkles } from 'lucide-react';

export default function Social() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(localStorage.getItem('chatUser') || "");
  const [isSet, setIsSet] = useState(!!localStorage.getItem('chatUser'));
  const [showStickers, setShowStickers] = useState(false);
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
    setText(""); setShowStickers(false);
  };
  const upload = async (e) => {
    const file = e.target.files[0]; if(!file) return;
    const r = ref(storage, "chat/" + Date.now() + "_" + file.name);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    await addDoc(collection(db, "mensajes"), { text: "Foto", imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
  };
  const del = async (id) => {
    if(prompt("🔒 CLAVE ADMIN:") === "admin") await deleteDoc(doc(db, "mensajes", id));
  };

  if(!isSet) return <div className="h-full flex items-center justify-center p-6 bg-black"><div className="w-full text-center"><Sparkles className="mx-auto mb-4 text-yellow-400"/><input className="p-3 bg-gray-900 rounded w-full mb-4 text-white text-center" placeholder="Tu Nombre" value={user} onChange={e=>setUser(e.target.value)}/><button onClick={()=>{if(user){localStorage.setItem('chatUser',user);setIsSet(true)}}} className="w-full bg-red-600 p-3 rounded font-bold">ENTRAR</button></div></div>;

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.name===user?'items-end':'items-start'}\`}>
            <span className="text-[10px] text-gray-500 mb-1">{m.name}</span>
            <div onDoubleClick={()=>del(m.id)} className={\`p-3 rounded-xl max-w-[85%] cursor-pointer \${m.type==='sticker'?'bg-transparent text-5xl': m.name===user?'bg-red-600':'bg-gray-800'}\`}>
              {m.type==='image' ? <img src={m.imageUrl} className="max-w-full rounded shadow-lg"/> : m.text}
            </div>
          </div>
        ))}
        <div ref={dummy}/>
      </div>
      {showStickers && <div className="grid grid-cols-6 p-2 bg-gray-900 border-t border-white/10">{STICKERS.map(s=><button key={s} onClick={async ()=>{await addDoc(collection(db,"mensajes"),{text:s,type:'sticker',name:user,createdAt:serverTimestamp()});setShowStickers(false)}} className="text-2xl p-2">{s}</button>)}</div>}
      <form onSubmit={send} className="p-3 bg-gray-950 flex gap-2 items-center">
        <button type="button" onClick={()=>setShowStickers(!showStickers)}><Smile/></button>
        <button type="button" onClick={()=>fileRef.current.click()}><Paperclip/></button>
        <input type="file" ref={fileRef} onChange={upload} hidden accept="image/*" />
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 bg-gray-900 p-2 rounded text-sm" placeholder="Mensaje..." />
        <button type="submit" className="bg-red-600 p-2 rounded"><Send size={18}/></button>
      </form>
    </div>
  );
}`;

// --- ESCRIBIR ARCHIVOS ---
fs.writeFileSync(path.join('src', 'index.css'), cssPro);
fs.writeFileSync(path.join('src', 'pages', 'Home.jsx'), homePro);
fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), socialPro);
fs.writeFileSync(path.join('src', 'ChatLive.jsx'), 'import React from "react"; import Social from "./pages/Social"; export default function ChatLive() { return <div className="h-full w-full"><Social /></div>; }');

console.log("✅ TODO RESTAURADO A VERSIÓN PRO.");