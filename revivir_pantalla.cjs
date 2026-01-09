const fs = require('fs');
const path = require('path');

console.log("🚑 REVIVIENDO LA PANTALLA DE INICIO...");

// 1. CÓDIGO DEL CHAT (Versión flexible h-full)
const chatCode = `import React, { useState, useEffect, useRef } from 'react';
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
    setText(""); setShowStickers(false);
  };
  const sendSticker = async (s) => {
    await addDoc(collection(db, "mensajes"), { text: s, type: 'sticker', name: user, createdAt: serverTimestamp() });
    setShowStickers(false);
  };
  const upload = async (e) => {
    const file = e.target.files[0]; if(!file) return; setUploading(true);
    try {
      const r = ref(storage, "chat/" + Date.now() + "_" + file.name);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await addDoc(collection(db, "mensajes"), { text: "Foto", imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
    } catch(e){alert("Error foto");} setUploading(false);
  };
  const del = async (id) => {
    if(prompt("CLAVE ADMIN:") === "admin") await deleteDoc(doc(db, "mensajes", id));
  };

  if(!isSet) return <div className="h-full flex items-center justify-center text-white"><div className="p-4 bg-gray-900 rounded w-64 text-center"><h3 className="mb-4 font-bold">Chat VIP</h3><input className="p-2 text-black w-full mb-2 rounded" placeholder="Apodo" onChange={e=>setUser(e.target.value)}/><button onClick={()=>{if(user){localStorage.setItem('chatUser',user);setIsSet(true)}}} className="bg-red-600 w-full p-2 rounded font-bold">ENTRAR</button></div></div>;

  return (
    <div className="flex flex-col h-full bg-black/50 text-white relative">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={"flex flex-col " + (m.name===user?"items-end":"items-start")}>
            <span className="text-[10px] text-gray-400 px-1">{m.name}</span>
            <div onDoubleClick={()=>del(m.id)} className={"p-2 px-3 rounded-xl max-w-[85%] cursor-pointer " + (m.name===user?"bg-red-600 rounded-tr-none":"bg-gray-800 rounded-tl-none")}>
              {m.type==='image' ? <img src={m.imageUrl} className="max-w-[200px] rounded"/> : m.type==='sticker'? <span className="text-4xl">{m.text}</span> : m.text}
            </div>
          </div>
        ))}
        <div ref={dummy}/>
      </div>
      {showStickers && <div className="absolute bottom-14 bg-gray-900 w-full p-2 grid grid-cols-6 gap-2 border-t border-white/10 z-50">{STICKERS.map(s=><button key={s} onClick={()=>sendSticker(s)} className="text-2xl hover:bg-white/10 rounded">{s}</button>)}</div>}
      <form onSubmit={send} className="p-2 bg-black/90 flex gap-2 border-t border-white/10">
        <button type="button" onClick={()=>setShowStickers(!showStickers)} className="text-yellow-400"><Smile/></button>
        <button type="button" onClick={()=>fileRef.current.click()} className="text-blue-400"><Paperclip/></button>
        <input type="file" hidden ref={fileRef} onChange={upload} accept="image/*" />
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 bg-gray-800 p-2 rounded text-white text-sm" disabled={uploading} placeholder="Escribe..."/>
        <button type="submit" className="bg-red-600 p-2 rounded text-white"><Send size={16}/></button>
      </form>
    </div>
  );
}`;

fs.writeFileSync(path.join('src', 'pages', 'Social.jsx'), chatCode);

// 2. EL PUENTE (Esto arregla la pantalla negra)
const bridgeCode = `import React from "react";
import Social from "./pages/Social"; 
export default function ChatLive() {
  return <div className="h-full w-full"><Social /></div>;
}`;

fs.writeFileSync(path.join('src', 'ChatLive.jsx'), bridgeCode);

console.log("✅ ¡LISTO! Pantalla negra solucionada.");