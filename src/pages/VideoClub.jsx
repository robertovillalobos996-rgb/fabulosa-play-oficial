import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'; // ESENCIAL para tus enlaces M3U8
import data from '../data/videoclub.json'; 

export default function VideoClub() {
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handlePlay = (item) => {
    setSelectedChannel(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 fade-in">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-black/95 p-4 flex items-center gap-4 border-b border-gray-800 shadow-xl">
        <Link to="/home" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">⬅</Link>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          FABULOSA TV
        </h1>
      </div>

      {/* REPRODUCTOR UNIVERSAL */}
      {selectedChannel && (
        <div className="w-full bg-black sticky top-[60px] z-50 shadow-2xl">
          <div className="aspect-video w-full h-[60vh] md:h-[80vh] relative bg-black">
            <button 
              onClick={() => setSelectedChannel(null)} 
              className="absolute top-4 right-4 z-20 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:scale-110 transition"
            >
              CERRAR X
            </button>
            
            {/* AQUÍ ESTÁ LA MAGIA: Detecta si es M3U8 o normal */}
            <ReactPlayer 
              url={selectedChannel.url}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
              playsinline={true} // Importante para móviles
              config={{
                file: { 
                  forceHLS: true, // Fuerza la lectura de tus enlaces m3u8
                  attributes: { style: { height: '100%', width: '100%', objectFit: 'contain' } } 
                }
              }}
              onError={(e) => console.log('Error de reproducción', e)}
            />
          </div>
          <div className="p-4 bg-[#1a1a1a] border-b border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🔴 EN VIVO: <span className="text-purple-400">{selectedChannel.titulo}</span>
            </h2>
          </div>
        </div>
      )}

      {/* LISTA DE CANALES */}
      <div className="p-4 space-y-8 max-w-[1600px] mx-auto">
        {data.categorias.map((cat, i) => (
          <div key={i}>
            <h3 className="text-lg font-bold mb-4 border-l-4 border-purple-500 pl-3 text-gray-200">{cat.titulo}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cat.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="cursor-pointer group relative hover:scale-105 transition-transform duration-300">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-800 shadow-lg border border-white/5 group-hover:border-purple-500">
                    <img src={item.poster} className="w-full h-full object-cover opacity-80 group-hover:opacity-100"/>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition">
                      <div className="bg-purple-600 p-2 rounded-full">▶</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium truncate text-gray-300 group-hover:text-white">{item.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}