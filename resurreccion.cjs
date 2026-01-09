const fs = require('fs');
const path = require('path');

console.log("🚑 INICIANDO RESURRECCIÓN DEL PROYECTO...");

// CARPETAS NECESARIAS
const dirs = ['src', 'src/pages', 'src/components', 'src/data'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. PACKAGE.JSON (Los ingredientes correctos)
const packageJson = {
  "name": "fabulosa-play",
  "version": "2.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": {
    "react": "^18.2.0", "react-dom": "^18.2.0", "react-router-dom": "^6.22.0",
    "firebase": "^10.8.0", "lucide-react": "^0.344.0", "framer-motion": "^11.0.0",
    "hls.js": "^1.5.0", "plyr": "^3.7.8", "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": { "@vitejs/plugin-react": "^4.2.0", "autoprefixer": "^10.4.18", "postcss": "^8.4.35", "tailwindcss": "^3.4.1", "vite": "^5.1.0" }
};
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// 2. FIREBASE.JS (Con soporte para FOTOS)
const firebaseCode = `import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDluA1iKHu1-qAlgRibqdUK1maMjPUqMCs",
  authDomain: "fabulosa-chat.firebaseapp.com",
  projectId: "fabulosa-chat",
  storageBucket: "fabulosa-chat.firebasestorage.app",
  messagingSenderId: "394855706516",
  appId: "1:394855706516:web:50d94f0c6647714e6f2981"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);`;
fs.writeFileSync(path.join('src', 'firebase.js'), firebaseCode);

// 3. LAYOUT.JSX (El archivo que faltaba y daba error)
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
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-white/10 p-4">
        <h1 className="text-xl font-bold mb-8 text-fuchsia-500">Fabulosa Play</h1>
        <nav className="space-y-2">{navItems.map(i => <Link key={i.path} to={i.path} className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl">{i.icon} {i.label}</Link>)}</nav>
      </aside>
      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto">{children}</div>
        <nav className="md:hidden flex justify-around p-3 bg-gray-900 border-t border-white/10">{navItems.map(i => <Link key={i.path} to={i.path} className="flex flex-col items-center p-2 text-gray-400">{i.icon}</Link>)}</nav>
      </main>
    </div>
  );
}`;
fs.writeFileSync(path.join('src', 'Layout.jsx'), layoutCode);

// 4. CHAT SOCIAL (Con Admin, Stickers y Fotos)
const socialCode = `import React, { useState, useEffect, useRef } from 'react';
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
    e.preventDefault();
    if(!text.trim()) return;
    await addDoc(collection(db, "mensajes"), { text, type: 'text', name: user, createdAt: serverTimestamp() });
    setText(""); setShowStickers(false);
  };
  const sendSticker = async (s) => {
    await addDoc(collection(db, "mensajes"), { text: s, type: 'sticker', name: user, createdAt: serverTimestamp() });
    setShowStickers(false);
  };
  const upload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const r = ref(storage, \`chat/\${Date.now()}_\${file.name}\`);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    await addDoc(collection(db, "mensajes"), { text: "Foto", imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
  };
  const del = async (id) => {
    if(prompt("🔒 ADMIN: Clave?") === "admin") await deleteDoc(doc(db, "mensajes", id));
  };

  if(!isSet) return <div className="h-full flex items-center justify-center bg-black text-white"><div className="p-8 bg-gray-900 rounded-xl text-center"><h2 className="text-xl mb-4 font-bold">Bienvenido</h2><input className="p-3 bg-black rounded w-full mb-4 text-white" placeholder="Tu nombre" value={user} onChange={e=>setUser(e.target.value)} /><button onClick={()=>{if(user) {localStorage.setItem('chatUser', user); setIsSet(true)}}} className="w-full bg-fuchsia-600 p-3 rounded font-bold">ENTRAR</button></div></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black/50 text-white relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.name===user?'items-end':'items-start'}\`}>
            <span className="text-xs text-gray-500 px-1">{m.name}</span>
            <div onDoubleClick={()=>del(m.id)} className={\`p-3 rounded-xl max-w-[80%] cursor-pointer \${m.type==='sticker'?'bg-transparent text-5xl': m.name===user?'bg-fuchsia-600':'bg-gray-800'}\`}>
              {m.type==='image' ? <img src={m.imageUrl} className="max-w-xs rounded"/> : m.text}
            </div>
          </div>
        ))}
        <div ref={dummy} />
      </div>
      {showStickers && <div className="bg-gray-900 p-2 grid grid-cols-6 gap-2 absolute bottom-20 w-full border-t border-white/10">{STICKERS.map(s=><button key={s} onClick={()=>sendSticker(s)} className="text-2xl hover:bg-white/10 rounded">{s}</button>)}</div>}
      <form onSubmit={send} className="p-3 bg-gray-900 flex gap-2">
        <button type="button" onClick={()=>setShowStickers(!showStickers)}><Smile/></button>
        <button type="button" onClick={()=>fileRef.current.click()}><Paperclip/></button>
        <input type="file" ref={fileRef} onChange={upload} hidden accept="image/*" />
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 bg-black p-2 rounded text-white" placeholder="Mensaje..." />
        <button type="submit"><Send/></button>
      </form>
    </div>
  );
}`;
fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), socialCode);

// 5. ARCHIVOS DE RELLENO (Radio, Karaoke, Home, etc.)
const dummyPage = (name) => \`import React from 'react'; export default function \${name}() { return <div className="p-10 text-white text-center"><h1 className="text-2xl">\${name}</h1><p>Sección disponible pronto.</p></div>; }\`;
['Home', 'Radio', 'Channels', 'VideoClub', 'Karaoke'].forEach(p => {
    if (!fs.existsSync(path.join('src', 'pages', \`\${p}.jsx\`))) {
        fs.writeFileSync(path.join('src', 'pages', \`\${p}.jsx\`), dummyPage(p));
    }
});

console.log("✅ ¡SISTEMA RECONSTRUIDO!");
console.log("👉 Ejecuta ahora: vercel --prod --force");