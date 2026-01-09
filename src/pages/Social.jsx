import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Smile, Paperclip, Sticker, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export default function Social() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(localStorage.getItem('chatUser') || "");
  const [isSet, setIsSet] = useState(!!localStorage.getItem('chatUser'));
  const [showEmoji, setShowEmoji] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const dummy = useRef();
  const fileRef = useRef();

  // Stickers locales (Asegúrate de tener estas imágenes en public/stickers/)
  const stickers = [
    { id: 1, url: '/stickers/s1.webp' },
    { id: 2, url: '/stickers/s2.webp' },
    { id: 3, url: '/stickers/s3.webp' },
    { id: 4, url: '/stickers/s4.webp' }
  ];

  useEffect(() => {
    const q = query(collection(db, "mensajes"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (s) => {
      setMessages(s.docs.map(d => ({ ...d.data(), id: d.id })));
      setTimeout(() => dummy.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsub();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, `chat/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "mensajes"), { imageUrl: url, type: 'image', name: user, createdAt: serverTimestamp() });
    } catch (err) { console.error(err); }
  };

  const sendSticker = async (url) => {
    await addDoc(collection(db, "mensajes"), { imageUrl: url, type: 'sticker', name: user, createdAt: serverTimestamp() });
    setShowStickers(false);
  };

  if (!isSet) return (
    <div className="h-full flex items-center justify-center p-6 bg-[#111b21]">
      <div className="w-full max-w-xs bg-[#202c33] p-8 rounded-3xl shadow-2xl text-white text-center border border-white/5">
        <div className="w-20 h-20 bg-[#00a884] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#00a884]/20">
          <img src="/logos/logo.png" className="w-12 h-12 object-contain" alt="Logo" />
        </div>
        <h2 className="mb-6 font-bold uppercase tracking-widest text-[#d1d7db] text-sm">Bienvenido a Fabulosa</h2>
        <input 
          className="w-full p-4 bg-[#2a3942] rounded-xl mb-6 text-center outline-none border-b-2 border-[#00a884] text-white" 
          placeholder="Escribe tu nombre..." 
          value={user}
          onChange={e => setUser(e.target.value)} 
        />
        <button 
          onClick={() => { if(user.trim()) { localStorage.setItem('chatUser', user); setIsSet(true); }}} 
          className="w-full bg-[#00a884] p-4 rounded-xl font-bold uppercase text-[#111b21] hover:bg-[#06cf9c] transition-all active:scale-95"
        >
          Entrar al Chat
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0b141a] relative border-l border-white/5">
      {/* Header estilo WhatsApp */}
      <div className="bg-[#202c33] p-3 px-4 text-white flex items-center gap-3 shadow-md z-10 border-b border-white/5">
        <div className="w-10 h-10 bg-[#6a7175] rounded-full flex items-center justify-center font-bold text-lg overflow-hidden">
          <img src="/logos/logo.png" className="w-full h-full object-cover" alt="Avatar" />
        </div>
        <div>
          <p className="text-sm font-bold">Fabulosa Live Chat</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#00a884] rounded-full animate-pulse"></span>
            <p className="text-[10px] text-[#8696a0]">en línea</p>
          </div>
        </div>
      </div>

      {/* Área de mensajes con el fondo clásico de WhatsApp */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
        {messages.map(m => (
          <div key={m.id} className={`flex flex-col ${m.name === user ? 'items-end' : 'items-start'}`}>
            <div 
              onDoubleClick={async () => { if(prompt("Clave de borrado:") === "1979") await deleteDoc(doc(db, "mensajes", m.id)); }} 
              className={`p-2 px-3 rounded-xl max-w-[85%] shadow-md relative ${m.name === user ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'}`}
            >
              <p className="text-[10px] text-[#34b7f1] font-bold mb-1">{m.name}</p>
              
              {m.type === 'image' || m.type === 'sticker' ? (
                <div className="relative group">
                  <img src={m.imageUrl} className={`${m.type === 'sticker' ? 'w-32' : 'w-full max-h-64 object-cover'} rounded-lg mt-1`} alt="Multimedia" />
                </div>
              ) : (
                <p className="text-[13px] leading-tight whitespace-pre-wrap">{m.text}</p>
              )}

              <div className="flex justify-end items-center gap-1 mt-1">
                <p className="text-[9px] text-white/50">
                  {m.createdAt?.toDate() ? m.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                </p>
                {m.name === user && <span className="text-[#34b7f1] text-[10px]">✓✓</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={dummy} />
      </div>

      {/* Paneles Flotantes (Emojis y Stickers) */}
      {showEmoji && <div className="absolute bottom-[62px] left-0 w-full z-50 animate-in slide-in-from-bottom-5"><EmojiPicker theme="dark" width="100%" onEmojiClick={(e) => setText(prev => prev + e.emoji)} /></div>}
      
      {showStickers && (
        <div className="absolute bottom-[62px] left-0 w-full bg-[#202c33] p-4 z-50 grid grid-cols-4 gap-4 border-t border-white/10 animate-in slide-in-from-bottom-5">
          {stickers.map(s => (
            <img key={s.id} src={s.url} className="w-full aspect-square object-contain cursor-pointer hover:scale-110 transition-transform" onClick={() => sendSticker(s.url)} alt="sticker" />
          ))}
        </div>
      )}

      {/* Input de mensajes estilo WhatsApp */}
      <form 
        onSubmit={async (e) => { 
          e.preventDefault(); 
          if(!text.trim()) return; 
          await addDoc(collection(db, "mensajes"), { text, type: 'text', name: user, createdAt: serverTimestamp() }); 
          setText(""); 
          setShowEmoji(false);
          setShowStickers(false);
        }} 
        className="p-2 bg-[#202c33] flex gap-2 items-center border-t border-white/5"
      >
        <div className="flex gap-1 text-[#8696a0]">
          <button type="button" className="p-2 hover:text-white transition-colors" onClick={() => { setShowEmoji(!showEmoji); setShowStickers(false); }}><Smile size={24}/></button>
          <button type="button" className="p-2 hover:text-white transition-colors" onClick={() => { setShowStickers(!showStickers); setShowEmoji(false); }}><Sticker size={24}/></button>
          <button type="button" className="p-2 hover:text-white transition-colors" onClick={() => fileRef.current.click()}><Paperclip size={24}/></button>
        </div>
        
        <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
        
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          className="flex-1 bg-[#2a3942] p-2.5 px-4 rounded-full text-sm text-white outline-none placeholder-[#8696a0] focus:ring-1 focus:ring-[#00a884]/30 transition-all" 
          placeholder="Escribe un mensaje" 
        />
        
        <button type="submit" className="bg-[#00a88