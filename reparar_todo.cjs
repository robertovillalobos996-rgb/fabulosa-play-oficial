const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log("🚑 INICIANDO REPARACIÓN DEL SISTEMA...");

// 1. ARREGLAR package.json (La lista de ingredientes)
const packageJson = {
  "name": "fabulosa-play",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "firebase": "^10.8.0",
    "lucide-react": "^0.344.0",
    "framer-motion": "^11.0.0",
    "hls.js": "^1.5.0",
    "plyr": "^3.7.8",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.0"
  }
};
fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(packageJson, null, 2));
console.log("✅ package.json corregido.");

// 2. ARREGLAR firebase.js (Conexión con Fotos)
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

fs.writeFileSync(path.join(__dirname, 'src', 'firebase.js'), firebaseCode);
console.log("✅ firebase.js corregido (Storage activado).");

// 3. ARREGLAR Social.jsx (El Chat Completo)
const socialCode = `import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Sparkles, Smile, Paperclip, X } from 'lucide-react';

export default function Social() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState(localStorage.getItem('chatUser') || "");
  const [isNameSet, setIsNameSet] = useState(!!localStorage.getItem('chatUser'));
  const [showStickers, setShowStickers] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dummyDiv = useRef(null);
  const fileInputRef = useRef(null);

  const ADMIN_PASSWORD = "admin"; 
  const STICKERS = ["😎", "😍", "🤣", "😱", "😡", "😭", "🥳", "👻", "👍", "👎", "🔥", "❤️", "🎉", "💯"];

  useEffect(() => {
    const q = query(collection(db, "mensajes"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setTimeout(() => dummyDiv.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    localStorage.setItem('chatUser', username);
    setIsNameSet(true);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "mensajes"), {
      text: newMessage, type: 'text', name: username, createdAt: serverTimestamp(),
    });
    setNewMessage(""); setShowStickers(false);
  };

  const sendSticker = async (emoji) => {
    await addDoc(collection(db, "mensajes"), {
      text: emoji, type: 'sticker', name: username, createdAt: serverTimestamp(),
    });
    setShowStickers(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileRef = ref(storage, \`chat_photos/\${Date.now()}_\${file.name}\`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await addDoc(collection(db, "mensajes"), {
        text: "Foto", imageUrl: url, type: 'image', name: username, createdAt: serverTimestamp(),
      });
    } catch (error) { alert("Error subiendo foto: " + error.message); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    const pwd = prompt("🔒 ADMIN: Contraseña para borrar:");
    if (pwd === ADMIN_PASSWORD) await deleteDoc(doc(db, "mensajes", id));
  };

  if (!isNameSet) return (
    <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center font-sans">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl w-full max-w-sm">
        <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse"/>
        <h2 className="text-white text-2xl font-bold mb-4">Bienvenido al Chat</h2>
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Tu Nombre..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-center outline-none"/>
          <button className="w-full bg-fuchsia-600 text-white font-bold py-3 rounded-xl shadow-lg">ENTRAR</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] font-sans relative">
      <div className="bg-black/40 backdrop-blur-md p-3 border-b border-white/10 flex justify-between items-center z-20">
        <span className="text-white font-bold text-sm tracking-wider">CHAT EN VIVO</span>
        <button onClick={() => {localStorage.removeItem('chatUser'); setIsNameSet(false)}} className="text-xs text-red-400 font-bold px-3 py-1 bg-white/5 rounded-full">SALIR</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.name === username;
          return (
            <div key={msg.id} className={\`flex flex-col \${isMe ? 'items-end' : 'items-start'}\`}>
              <span className={\`text-[10px] font-bold px-2 mb-1 \${isMe ? 'text-fuchsia-400' : 'text-gray-400'}\`}>{msg.name}</span>
              <div onDoubleClick={() => handleDelete(msg.id)} className={\`cursor-pointer max-w-[85%] rounded-2xl p-3 \${
                msg.type === 'sticker' ? 'bg-transparent text-5xl hover:scale-110 transition-transform' :
                msg.type === 'image' ? 'bg-transparent p-0 border-2 border-white/10 overflow-hidden' :
                isMe ? 'bg-fuchsia-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'
              }\`}>
                {msg.type === 'image' ? <img src={msg.imageUrl} className="max-w-full max-h-60 object-cover" /> : msg.text}
              </div>
            </div>
          );
        })}
        <div ref={dummyDiv}></div>
      </div>

      {showStickers && (
        <div className="absolute bottom-20 left-4 right-4 bg-gray-900 border border-white/10 rounded-2xl p-4 z-30 shadow-2xl grid grid-cols-5 gap-4 h-40 overflow-y-auto">
          {STICKERS.map((s, i) => <button key={i} onClick={() => sendSticker(s)} className="text-3xl hover:scale-125">{s}</button>)}
        </div>
      )}

      <div className="p-3 bg-black/80 border-t border-white/10 z-20">
        <form onSubmit={sendMessage} className="flex gap-2 items-center">
          <button type="button" onClick={() => setShowStickers(!showStickers)} className="p-3 bg-gray-800 rounded-full text-yellow-400"><Smile size={20}/></button>
          <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 bg-gray-800 rounded-full text-cyan-400"><Paperclip size={20}/></button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Mensaje..." disabled={uploading} className="flex-1 bg-gray-900 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"/>
          <button type="submit" disabled={!newMessage.trim() && !uploading} className="p-3 bg-fuchsia-600 rounded-full text-white shadow-lg">{uploading ? "..." : <Send size={20}/>}</button>
        </form>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Social.jsx'), socialCode);
console.log("✅ Social.jsx corregido.");

// 4. INSTALAR Y PROBAR
console.log("\n📦 Instalando todo desde cero...");
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log("✅ Instalación completada.");
  
  console.log("\n🏗️  Probando construcción local...");
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n🚀 ¡PRUEBA EXITOSA! Ahora puedes subir a Vercel.");
  
} catch (error) {
  console.log("\n❌ ERROR DETECTADO EN TU PC:");
  console.log("Si lees esto, mándame el error que sale arriba.");
}