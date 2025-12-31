import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import data from "../data/videoclub.json";

export default function VideoClub() {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(false);

  const categorias = useMemo(() => {
    return Array.isArray(data?.categorias) ? data.categorias : [];
  }, []);

  const handlePlay = (item) => {
    setError(false);
    setSelected(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 font-sans">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center gap-6 shadow-2xl">
        <Link
          to="/home"
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all transform hover:scale-105 active:scale-95"
          title="Volver"
        >
          ⬅
        </Link>

        <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">
            FABULOSA
          </span>
          <span className="text-white">PLAY</span>{" "}
          <span className="text-xs align-top bg-[#00d2ff] text-black px-1 rounded font-bold not-italic">
            VIDEO CLUB
          </span>
        </h1>
      </div>

      {/* PLAYER */}
      {selected && (
        <div className="w-full bg-black sticky top-[76px] z-40 shadow-2xl border-b border-gray-800">
          <div className="max-w-[1900px] mx-auto relative aspect-video h-[50vh] md:h-[80vh] bg-black">
            <button
              onClick={() => {
                setSelected(null);
                setError(false);
              }}
              className="absolute top-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-2xl transition-all hover:scale-110 flex items-center gap-2"
            >
              <span>✖</span> CERRAR
            </button>

            {!error ? (
              <ReactPlayer
                url={selected.url}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
                playsinline={true}
                onError={() => setError(true)}
                config={{
                  file: {
                    forceHLS: String(selected.url || "").includes(".m3u8"),
                    attributes: {
                      style: {
                        height: "100%",
                        width: "100%",
                        objectFit: "contain"
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] text-center p-6">
                <span className="text-6xl mb-4">📡</span>
                <h3 className="text-2xl font-bold text-red-500">
                  Error al reproducir
                </h3>
                <p className="text-gray-400 mt-2">
                  Este enlace puede estar caído o bloqueado (CORS). Probá otro.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#111]">
            <h2 className="text-2xl font-bold text-white">{selected.titulo}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {selected.duracion ? `Duración: ${selected.duracion} • ` : ""}
              Streaming
            </p>
          </div>
        </div>
      )}

      {/* CATÁLOGO */}
      <div className="px-4 md:px-8 py-10 space-y-14 max-w-[2000px] mx-auto">
        {categorias.map((cat, i) => (
          <div key={i}>
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-white border-l-4 border-[#00d2ff] pl-4">
              {cat.titulo}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {(cat.contenido || []).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handlePlay(item)}
                  className="cursor-pointer group relative transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-[#00d2ff]/50 ring-2 ring-transparent group-hover:ring-[#00d2ff] transition-all">
                    <img
                      src={item.poster}
                      alt={item.titulo}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-all duration-300">
                      <div className="bg-[#00d2ff] text-black w-12 h-12 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,210,255,0.6)] transform scale-50 group-hover:scale-110 transition-transform duration-300">
                        ▶
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 px-1">
                    <p className="text-sm font-bold text-gray-200 group-hover:text-[#00d2ff] truncate transition-colors">
                      {item.titulo}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.tipo === "vod"
                        ? item.duracion
                          ? `VOD • ${item.duracion}`
                          : "VOD"
                        : cat.tipo === "series"
                        ? "Serie"
                        : "En Vivo"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {categorias.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No hay categorías cargadas. Revisá `src/data/videoclub.json`.
          </div>
        )}
      </div>
    </div>
  );
}
