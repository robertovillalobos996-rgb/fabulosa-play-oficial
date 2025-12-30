import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'; // Importamos el reproductor profesional
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
      <div className="sticky top-0 z-40 bg-gradient-to-b from-black/90 to-transparent p-4 flex items-center gap-4">
        <Link to="/home" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-widest">
          FABULOSA<span className="text-[#ff00bf]">PLAY</span>
        </h1>
      </div>

      {/* REPRODUCTOR DE CINE (SOPORTA TODO) */}
      {selectedMovie && (
        <div className="w-full bg-black sticky top-0 z-50 shadow-2xl animate-fade-in">
          <div className="w-full h-[60vh] md:h-[80vh] relative bg-black">
            
            {/* Botón Cerrar Flotante */}
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-6 right-6 z-20 bg-black/50 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md transition-all"
            >
              ✕ CERRAR
            </button>

            {/* AQUÍ ESTÁ LA MAGIA: ReactPlayer maneja YouTube, MP4 y M3U8 automáticamente */}
            <ReactPlayer 
              url={selectedMovie.url}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
              config={{
                file: {
                  attributes: {
                    style: { objectFit: 'cover', width: '100%', height: '100%' }
                  }
                }
              }}
            />
          </div>
          
          <div className="p-6 bg-[#181818]">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedMovie.titulo}</h2>
            <p className="text-gray-400 text-sm">Reproduciendo ahora • Calidad HD</p>
          </div>
        </div>
      )}

      {/* CATALOGO (Igual que antes pero más limpio) */}
      <div className="max-w-[1600px] mx-auto px-4 pt-6 space-y-12">
        {data.categorias.map((categoria, index) => (
          <div key={index}>
            <h3 className="text-xl font-bold mb-4 text-white/90 pl-2 border-l-4 border-[#ff00bf]">
              {categoria.titulo}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-2">
              {categoria.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="shrink-0 w-[200px] cursor-pointer group relative transition-all duration-300 hover:scale-105 z-10 hover:z-20">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-[#ff00bf]/40">
                    <img src={item.poster} alt={item.titulo} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"/>
                    
                    {/* Icono de Play al pasar el mouse */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="bg-[#ff00bf] rounded-full p-3 shadow-xl">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="mt-3 text-sm font-medium text-gray-300 group-hover:text-white truncate">{item.titulo}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}