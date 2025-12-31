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
      
      {/* CABECERA ESTILO NETFLIX */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md shadow-lg p-4 flex items-center gap-4 border-b border-gray-800">
        <Link to="/home" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff00bf] to-purple-500 tracking-wider">
          FABULOSA<span className="text-white">PLAY</span>
        </h1>
      </div>

      {/* PANTALLA DE CINE */}
      {selectedMovie && (
        <div className="w-full bg-black sticky top-[70px] z-50 shadow-2xl animate-fade-in border-b border-gray-800">
          <div className="w-full aspect-video md:h-[75vh] relative bg-black mx-auto max-w-[1800px]">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-red-600/90 text-white border border-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md transition-all flex items-center gap-2"
            >
              <span>✖</span> CERRAR CINE
            </button>

            {/* LÓGICA DE REPRODUCCIÓN UNIVERSAL (Sin librerías externas) */}
            <iframe 
              className="w-full h-full"
              src={
                selectedMovie.fuente === 'youtube' 
                  ? `https://www.youtube.com/embed/${selectedMovie.url}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&color=white`
                  : selectedMovie.url
              }
              title={selectedMovie.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="p-6 bg-[#121212] border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-1">{selectedMovie.titulo}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="bg-[#ff00bf] text-white px-2 py-0.5 rounded text-xs font-bold">HD</span>
              <span>• {selectedMovie.duracion || 'Película Completa'}</span>
            </div>
          </div>
        </div>
      )}

      {/* CATÁLOGO DE 100+ OPCIONES */}
      <div className="max-w-[1800px] mx-auto px-4 pt-8 space-y-12">
        {data.categorias.map((categoria, index) => (
          <div key={index}>
            <h3 className="text-xl md:text-2xl font-bold mb-5 text-white pl-4 border-l-4 border-[#ff00bf]">
              {categoria.titulo}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-8 px-2 scrollbar-hide snap-x">
              {categoria.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="shrink-0 w-[160px] md:w-[220px] snap-start cursor-pointer group relative transition-all duration-300 hover:scale-105 z-10 hover:z-20">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 shadow-lg group-hover:shadow-[#ff00bf]/30 ring-1 ring-white/10 group-hover:ring-[#ff00bf]/50">
                    <img src={item.poster} alt={item.titulo} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy"/>
                    
                    {/* Botón Play Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-[2px]">
                      <div className="bg-[#ff00bf] rounded-full p-3 shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                        <svg className="w-8 h-8 text-white pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="mt-3 text-sm font-medium text-gray-300 group-hover:text-white truncate px-1">{item.titulo}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}