import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/videoclub.json'; 

export default function VideoClub() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handlePlay = (item) => {
    setSelectedMovie(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 fade-in">
      
      {/* CABECERA */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4 flex items-center gap-4">
        <Link to="/home" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#ff00bf] to-purple-600">
          VIDEO CLUB
        </h1>
      </div>

      {/* REPRODUCTOR */}
      {selectedMovie && (
        <div className="w-full bg-black sticky top-[70px] z-50 shadow-2xl border-b border-gray-800 animate-fade-in">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video w-full bg-black">
              <button 
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 z-20 bg-red-600/90 hover:bg-red-600 px-3 py-1 rounded text-xs font-bold shadow-lg"
              >
                CERRAR
              </button>

              {selectedMovie.fuente === 'youtube' && (
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${selectedMovie.url}?autoplay=1&rel=0`} allow="autoplay; encrypted-media" allowFullScreen />
              )}
              {selectedMovie.fuente === 'archive' && (
                <iframe className="w-full h-full" src={selectedMovie.url} allowFullScreen />
              )}
               {selectedMovie.fuente === 'm3u8' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 p-4 text-center">
                   <p>⚠️ Para ver canales M3U8 usa tu celular.</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-[#151515]">
              <h2 className="text-lg font-bold text-white">{selectedMovie.titulo}</h2>
            </div>
          </div>
        </div>
      )}

      {/* CATALOGO */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-10">
        {data.categorias.map((categoria, index) => (
          <div key={index}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400 border-l-4 border-[#ff00bf] pl-3">
              {categoria.titulo}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
              {categoria.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="shrink-0 w-[160px] cursor-pointer group relative hover:scale-105 transition-transform duration-300">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 border border-gray-800 group-hover:border-[#ff00bf]">
                    <img src={item.poster} alt={item.titulo} className="w-full h-full object-cover" loading="lazy"/>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-300 truncate">{item.titulo}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
