import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import data from '../data/videoclub.json';

export default function VideoClub() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [error, setError] = useState(false);

  const handlePlay = (item) => {
    setError(false);
    setSelectedChannel(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 font-sans">
      {/* HEADER PREMIUM */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800 px-6 py-4 flex items-center gap-6 shadow-2xl">
        <Link to="/home" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all transform hover:scale-110">
          ⬅
        </Link>
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">
          FABULOSA<span className="text-white">PLAY</span> PRO
        </h1>
      </div>

      {/* CINE / REPRODUCTOR */}
      {selectedChannel && (
        <div className="w-full bg-black sticky top-[72px] z-40 shadow-2xl border-b border-gray-800 animate-fade-in">
          <div className="max-w-[1800px] mx-auto relative aspect-video h-[50vh] md:h-[75vh] bg-black">
            <button 
              onClick={() => setSelectedChannel(null)} 
              className="absolute top-4 right-4 z-50 bg-red-600/90 hover:bg-red-600 text-white px-5 py-2 rounded-full font-bold tracking-wide shadow-lg transition-all hover:scale-105 backdrop-blur-sm"
            >
              CERRAR ✕
            </button>
            
            {!error ? (
              <ReactPlayer 
                url={selectedChannel.url}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
                playsinline={true}
                config={{
                  file: { 
                    forceHLS: true,
                    attributes: { style: { height: '100%', width: '100%', objectFit: 'contain' } } 
                  }
                }}
                onError={() => setError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-center p-6">
                <span className="text-4xl mb-4">📡</span>
                <h3 className="text-xl font-bold text-red-500">Señal no disponible en web</h3>
                <p className="text-gray-400 mt-2">Este canal requiere la App nativa por seguridad.</p>
              </div>
            )}
          </div>
          <div className="p-5 bg-[#121212]">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              {selectedChannel.titulo}
            </h2>
          </div>
        </div>
      )}

      {/* CATÁLOGO ESTILO NETFLIX */}
      <div className="px-6 py-8 space-y-12 max-w-[1900px] mx-auto">
        {data.categorias.map((cat, i) => (
          <div key={i}>
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-white border-l-4 border-[#00d2ff] pl-4">
              {cat.titulo}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {cat.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="cursor-pointer group relative transition-all duration-300 hover:scale-105 hover:z-10">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-[#00d2ff]/40 ring-2 ring-transparent group-hover:ring-[#00d2ff]">
                    <img 
                      src={item.poster} 
                      alt={item.titulo}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-all duration-300 backdrop-blur-[2px]">
                      <div className="bg-[#00d2ff] text-black p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                        ▶
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-400 group-hover:text-white truncate transition-colors pl-1">{item.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}