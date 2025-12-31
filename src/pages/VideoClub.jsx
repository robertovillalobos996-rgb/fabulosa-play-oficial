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
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-black/95 p-4 flex items-center gap-4 border-b border-gray-800">
        <Link to="/home" className="bg-white/10 p-2 rounded-full">⬅</Link>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          FABULOSA PLAY
        </h1>
      </div>

      {/* REPRODUCTOR */}
      {selectedMovie && (
        <div className="w-full bg-black sticky top-[60px] z-50">
          <div className="aspect-video w-full relative">
            <button onClick={() => setSelectedMovie(null)} className="absolute top-2 right-2 z-20 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
              X CERRAR
            </button>
            <iframe 
              className="w-full h-full"
              // ESTA LÍNEA ES LA CLAVE: Soporta Videos normales y Listas de Reproducción
              src={`https://www.youtube.com/embed/${selectedMovie.url}?autoplay=1&modestbranding=1&rel=0`}
              title="Reproductor"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4 bg-gray-900">
            <h2 className="font-bold">{selectedMovie.titulo}</h2>
          </div>
        </div>
      )}

      {/* LISTA */}
      <div className="p-4 space-y-8">
        {data.categorias.map((cat, i) => (
          <div key={i}>
            <h3 className="text-lg font-bold mb-3 border-l-4 border-purple-500 pl-2">{cat.titulo}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {cat.contenido.map((item) => (
                <div key={item.id} onClick={() => handlePlay(item)} className="shrink-0 w-[160px] cursor-pointer">
                  <img src={item.poster} className="rounded-lg w-full h-[240px] object-cover bg-gray-800"/>
                  <p className="mt-2 text-sm truncate">{item.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}