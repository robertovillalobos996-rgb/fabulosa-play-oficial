import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Send, Smile, Paperclip, Sticker } from 'lucide-react';
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

  // Stickers (Asegúrate de tenerlos en public/stickers/ o usa URLs directas)
  const stickers = [
    { id: 1, url: '/stickers/s1.webp' },
    { id: 2, url: '/stickers/s2.webp' },
    { id: 3, url: '/stickers/s3.webp' }
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
    } catch (err) { console.error("Error subiendo archivo:", err); }
  };

  const sendSticker = async (url) => {
    await addDoc(collection(db, "mensajes"), { imageUrl: url, type: 'sticker', name: user, createdAt: serverTimestamp() });
    setShowStickers(false);
  };

  if (!isSet) return (
    <div className="h-full flex items-center justify-center p-6 bg-[#111b21]">
      <div className="w-full max-w-xs bg-[#202c33] p-8 rounded-3xl shadow-2xl text-white text-center">
        <h2 className="mb-6 font-bold uppercase tracking-widest text-[#d1d7db]">Tu Nombre para el Chat</h2>
        <input 
          className="w-full p-4 bg-[#2a3942] rounded-xl mb-6 text-center outline-none border-b-2 border-[#00a884] text-white" 
          placeholder="Escribe aquí..." 
          value={user}
          onChange={e => setUser(e.target.value)} 
        />
        <button 
          onClick={() => { if(user.trim()) { localStorage.setItem('chatUser', user); setIsSet(true); }}} 
          className="w-full bg-[#00a884] p-4 rounded-xl font-bold uppercase text-[#111b21]"
        >
          ENTRAR
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0b141a] relative border-l border-white/5">
      {/* Header WhatsApp */}
      <div className="bg-[#202c33] p-3 px-4 text-white flex items-center gap-3 shadow-md z-10">
        <div className="w-10 h-10 bg-[#6a7175] rounded-full flex items-center justify-center font-bold">F</div>
        <div>
          <p className="text-sm font-bold text-white">Fabulosa Live Chat</p>
          <p className="text-[10px] text-[#00a884]">en línea</p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map(m => (
          <div key={m.id} className={`flex flex-col ${m.name === user ? 'items-end' : 'items-start'}`}>
            <div 
              onDoubleClick={async () => { if(prompt("Clave:") === "1979") await deleteDoc(doc(db, "mensajes", m.id)); }} 
              className={`p-2 px-3 rounded-xl max-w-[85%] shadow-sm ${m.name === user ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'}`}
            >
              <p className="text-[10px] text-[#34b7f1] font-bold mb-1">{m.name}</p>
              {m.imageUrl ? (
                <img src={m.imageUrl} className={`${m.type === 'sticker' ? 'w-32' : 'w-full'} rounded-lg mt-1`} alt="Multimedia" />
              ) : (
                <p className="text-sm">{m.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={dummy} />
      </div>

      {/* Input de Mensaje */}
      {showEmoji && <div className="absolute bottom-[62px] left-0 w-full z-50"><EmojiPicker theme="dark" width="100%" onEmojiClick={(e) => setText(prev => prev + e.emoji)} /></div>}
      
      {showStickers && (
        <div className="absolute bottom-[62px] left-0 w-full bg-[#202c33] p-4 z-50 grid grid-cols-4 gap-4 border-t border-white/10">
          {stickers.map(s => (
            <img key={s.id} src={s.url} className="w-full cursor-pointer" onClick={() => sendSticker(s.url)} alt="sticker" />
          ))}
        </div>
      )}

      <form 
        onSubmit={async (e) => { 
          e.preventDefault(); 
          if(!text.trim()) return; 
          await addDoc(collection(db, "mensajes"), { text, type: 'text', name: user, createdAt: serverTimestamp() }); 
          setText(""); 
          setShowEmoji(false);
          setShowStickers(false);
        }} 
        className="p-2 bg-[#202c33] flex gap-2 items-center"
      >
        <button type="button" className="text-[#8696a0]" onClick={() => { setShowEmoji(!showEmoji); setShowStickers(false); }}><Smile/></button>
        <button type="button" className="text-[#8696a0]" onClick={() => { setShowStickers(!showStickers); setShowEmoji(false); }}><Sticker/></button>
        <button type="button" className="text-[#8696a0]" onClick={() => fileRef.current.click()}><Paperclip/></button>
        
        <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
        
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          className="flex-1 bg-[#2a3942] p-2 rounded-full text-sm text-white outline-none px-4" 
          placeholder="Mensaje" 
        />
        
        <button type="submit" className="bg-[#00a884] p-2 rounded-full text-[#111b21]"><Send size={20}/></button>
      </form>
    </div>
  );
}