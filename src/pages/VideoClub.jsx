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
      <div className="sticky top-0 z-40 bg-black/95 border-b border-gray-800 p-4 flex items-center gap-4 shadow-xl">
        <Link to="/home" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          FABULOSA PLAY
        </h1>
      </div>

      {/* REPRODUCTOR TIPO CINE (IFRAME PURO) */}
      {selectedMovie && (
        <div className="w-full bg-black sticky top-[70px] z-50 shadow-2xl animate-fade-in border-b border-gray-800">
          <div className="max-w-[1800px] mx-auto relative aspect-video md:h-[80vh] bg-black">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-30 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-transform hover:scale-105"
            >
              ✖ CERRAR
            </button>

            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${selectedMovie.url}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
              title="Reproductor"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4 bg-[#1a1a1a]">
            <h2 className="text-xl font-bold text-white">{selectedMovie.titulo}</h2>
            <p className="text-gray-400 text-sm">Fuente: Canal Oficial • {selectedMovie.duracion}</p>
          </div>
        </div>
      )}

      {/* LISTA DE CONTENIDO */}
      <div className="max-w-[1900px] mx-auto px-4 pt-8 space-y-12">
        {data.categorias.map((categoria, index) => (
          <div key={index}>
            <h3 className="text-xl font-bold mb-4 text-white pl-4 border-l-4 border-purple-500">
              {categoria.titulo}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 px-2 scrollbar-hide snap-x">
              {categoria.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="shrink-0 w-[180px] md:w-[240px] snap-start cursor-pointer group relative hover:scale-105 transition-all duration-300">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 shadow-lg border border-white/5">
                    <img src={item.poster} alt={item.titulo} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" loading="lazy"/>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="bg-purple-600 rounded-full p-3 shadow-xl">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-300 group-hover:text-white truncate">{item.titulo}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}