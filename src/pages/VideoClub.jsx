import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'; // Usamos el reproductor potente
import data from '../data/videoclub.json'; 

export default function VideoClub() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handlePlay = (item) => {
    setSelectedMovie(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 fade-in">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-800">
        <Link to="/home" className="bg-white/10 p-2 rounded-full hover:bg-white/20">⬅</Link>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          FABULOSA PLAY
        </h1>
      </div>

      {/* PANTALLA DE CINE */}
      {selectedMovie && (
        <div className="w-full bg-black sticky top-[60px] z-50 shadow-2xl">
          <div className="aspect-video w-full h-[60vh] md:h-[80vh] relative bg-black">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-20 bg-red-600 px-4 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
              ✕ CERRAR
            </button>
            
            {/* AQUÍ ESTÁ LA SOLUCIÓN: ReactPlayer abre TODO */}
            <ReactPlayer 
              url={selectedMovie.url}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
              config={{
                file: { attributes: { style: { height: '100%', width: '100%', objectFit: 'contain' } } }
              }}
            />
          </div>
          <div className="p-4 bg-gray-900">
            <h2 className="text-xl font-bold text-white">{selectedMovie.titulo}</h2>
            <p className="text-gray-400 text-sm">Señal Digital • Alta Definición</p>
          </div>
        </div>
      )}

      {/* LISTA DE CANALES */}
      <div className="p-6 space-y-10 max-w-[1600px] mx-auto">
        {data.categorias.map((cat, i) => (
          <div key={i}>
            <h3 className="text-xl font-bold mb-4 border-l-4 border-purple-500 pl-3 text-gray-100">{cat.titulo}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cat.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="shrink-0 w-[200px] cursor-pointer group hover:scale-105 transition-transform duration-300">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 relative">
                    <img src={item.poster} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                       <span className="bg-purple-600 text-white p-3 rounded-full">▶</span>
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