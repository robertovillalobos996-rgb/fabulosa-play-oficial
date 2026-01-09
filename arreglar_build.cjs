const fs = require('fs');
const path = require('path');

// Aseguramos que el directorio exista
const pagesDir = path.join('src', 'pages');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

// 1. Corregimos el Chat para que no de error al compilar
const socialFix = `import React, { useState, useEffect, useRef } from 'react';
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
  const dummy = useRef();
  const fileRef = useRef();

  useEffect(() => {
    const q = query(collection(db, "mensajes"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (s) => {
      setMessages(s.docs.map(d => ({ ...d.data(), id: d.id })));
      setTimeout(() => dummy.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsub();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const storageRef = ref(storage, "chat/" + Date.now() + "_" + file.name);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "mensajes"), { imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
    } catch (err) { console.error(err); }
    setShowMenu(false);
  };

  if(!isSet) return (
    <div className="h-full flex items-center justify-center p-6 bg-[#111b21]">
      <div className="w-full bg-[#202c33] p-8 rounded-3xl shadow-2xl">
        <input className="w-full p-4 bg-[#2a3942] rounded-xl text-white mb-6 text-center" placeholder="Tu Nombre..." onChange={e => setUser(e.target.value)} />
        <button onClick={() => { if(user.trim()) { localStorage.setItem('chatUser', user); setIsSet(true); }}} className="w-full bg-[#00a884] p-4 rounded-xl font-bold">ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0b141a]">
      <div className="bg-[#202c33] p-4 text-white flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs">F</div>
        <p className="text-xs font-bold">Chat en Vivo</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/20">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.name === user ? 'items-end' : 'items-start'}\`}>
            <div onDoubleClick={async () => { if(prompt("Clave:") === "1979") await deleteDoc(doc(db, "mensajes", m.id)); }} className={\`p-2 px-3 rounded-xl max-w-[85%] \${m.name === user ? 'bg-[#005c4b]' : 'bg-[#202c33]'}\`}>
              <p className="text-[8px] text-red-400 font-bold">\${m.name}</p>
              {m.imageUrl ? <img src={m.imageUrl} className="rounded-lg mt-1" /> : <p className="text-sm">\${m.text}</p>}
            </div>
          </div>
        ))}
        <div ref={dummy} />
      </div>
      {showEmoji && <div className="absolute bottom-16 w-full z-50"><EmojiPicker theme="dark" width="100%" onEmojiClick={(e) => setText(prev => prev + e.emoji)} /></div>}
      <form onSubmit={async (e) => { e.preventDefault(); if(!text.trim()) return; await addDoc(collection(db, "mensajes"), { text, type: 'text', name: user, createdAt: serverTimestamp() }); setText(""); }} className="p-3 bg-[#202c33] flex gap-2">
        <button type="button" onClick={() => setShowEmoji(!showEmoji)}><Smile size={20}/></button>
        <button type="button" onClick={() => setShowMenu(!showMenu)}><Paperclip size={20}/></button>
        <input type="file" ref={fileRef} className="hidden" onChange={handleFileUpload} />
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 bg-[#2a3942] p-2 rounded-lg text-sm" placeholder="Mensaje..." />
        <button type="submit" className="bg-[#00a884] p-2 rounded-full"><Send size={18}/></button>
      </form>
    </div>
  );
}`;

fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), socialFix);
console.log("✅ ARCHIVO CORREGIDO PARA EL BUILD.");