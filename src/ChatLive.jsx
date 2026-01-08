import React, { useState, useEffect, useRef } from 'react';
// Usamos la conexión correcta que ya funciona
import { db } from './firebase'; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send, User, Sparkles } from 'lucide-react';

const ChatLive = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState(localStorage.getItem('chatUser') || "");
  const [isNameSet, setIsNameSet] = useState(!!localStorage.getItem('chatUser'));
  const dummyDiv = useRef(null);

  // --- LÓGICA (Igual que antes, funciona bien) ---
  useEffect(() => {
    const q = query(collection(db, "mensajes"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setMessages(msgs);
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
    try {
      await addDoc(collection(db, "mensajes"), {
        text: newMessage,
        name: username,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --- DISEÑO NUEVO: PANTALLA DE INGRESO (Efecto Cristal) ---
  if (!isNameSet) {
    return (
      <div className="relative h-full flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
        {/* Fondo animado sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-black to-black z-0"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-600/30 rounded-full blur-[100px] animate-pulse-slow"></div>
        
        <div className="relative z-10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)] flex flex-col items-center w-full max-w-xs">
          <div className="mb-4 p-3 bg-red-600/20 rounded-full shadow-[0_0_15px_red]"><Sparkles size={32} className="text-red-400" /></div>
          <h3 className="text-xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400 tracking-wider uppercase">
            Sala VIP
          </h3>
          <p className="text-red-200/70 text-sm mb-6 text-center">Identifícate para entrar en vivo.</p>
          <form onSubmit={handleNameSubmit} className="flex flex-col w-full gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <input 
                type="text" 
                placeholder="Tu Apodo Exclusivo..." 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="relative w-full p-4 bg-black rounded-xl border border-white/10 text-white text-center outline-none focus:border-red-500 placeholder:text-gray-600 transition-all"
              />
            </div>
            <button type="submit" className="relative overflow-hidden group bg-gradient-to-r from-red-700 to-red-900 py-3 rounded-xl font-bold tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <span className="relative z-10 text-red-100 group-hover:text-white">ACCEDER AHORA</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DISEÑO NUEVO: SALA DE CHAT (Efecto Premium) ---
  return (
    <div className="flex flex-col h-full text-white font-sans relative overflow-hidden">
      {/* Capas de fondo para profundidad */}
      <div className="absolute inset-0 bg-[#0a0a0a] z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-800/30 via-transparent to-transparent z-0 pointer-events-none animate-pulse"></div>

      {/* CONTENIDO PRINCIPAL (Con Backdrop Blur) */}
      <div className="relative z-10 flex flex-col h-full backdrop-blur-[2px] bg-black/20">
        
        {/* Cabecera de Cristal */}
        <div className="p-4 border-b border-red-500/20 bg-gradient-to-r from-black/60 to-red-950/30 flex justify-between items-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-red-600/5 blur-md"></div> {/* Brillo sutil */}
          <div className="flex items-center gap-2 relative z-10">
             <span className="flex h-3 w-3 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
             </span>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-white font-black italic tracking-widest uppercase text-sm">
                LIVE CHAT
             </span>
          </div>
          
          <div className="flex items-center gap-2 relative z-10 bg-black/40 py-1 px-3 rounded-full border border-white/10">
            <User size={14} className="text-red-400" /> 
            <span className="font-bold text-gray-200 text-xs">{username}</span>
            <button 
              onClick={() => { localStorage.removeItem('chatUser'); setIsNameSet(false); }} 
              className="text-red-500/70 hover:text-red-400 ml-2 text-xs uppercase font-bold transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-black/20">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
               <Sparkles size={40} className="text-red-700 mb-2 animate-pulse" />
               <p className="text-red-300/50 text-sm italic">La sala está en silencio... Rompe el hielo.</p>
            </div>
          )}
          
          {messages.map((msg) => {
            const isMe = msg.name === username;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group animate-fade-in-up`}>
                <span className={`text-[10px] font-bold px-2 mb-1 tracking-wider ${isMe ? 'text-red-300/80' : 'text-gray-500'}`}>
                  {msg.name.toUpperCase()}
                </span>
                {/* Burbujas de Chat Premium */}
                <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] break-words relative overflow-hidden shadow-lg transition-all hover:scale-[1.02] ${
                  isMe 
                  ? 'bg-gradient-to-br from-red-700 via-red-800 to-red-950 text-white rounded-tr-sm border-l-2 border-red-500/50 shadow-[0_5px_15px_rgba(220,38,38,0.3)]' 
                  : 'bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/5 text-gray-200 rounded-tl-sm shadow-[0_5px_15px_rgba(0,0,0,0.3)]'
                }`}>
                  {/* Reflejo de luz en las burbujas */}
                  <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none ${isMe ? 'mix-blend-overlay' : ''}`}></div>
                  <p className="relative z-10 leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={dummyDiv}></div>
        </div>

        {/* Input de Envío Premium */}
        <form onSubmit={sendMessage} className="p-4 bg-[#0a0a0a] border-t border-red-900/30 flex gap-3 relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <div className="relative flex-1 group">
            {/* Brillo al enfocar */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/50 to-red-900/50 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              placeholder="Escribe algo épico..." 
              className="relative w-full bg-black/50 border border-red-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 focus:bg-black/80 placeholder:text-red-300/30 transition-all" 
            />
          </div>
          <button 
            type="submit" 
            disabled={!newMessage.trim()} 
            className="group relative p-3 bg-gradient-to-r from-red-700 to-red-900 rounded-xl text-white hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Send size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatLive;