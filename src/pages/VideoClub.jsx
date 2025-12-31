import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hls from "hls.js";
import data from "../data/videoclub.json";

export default function VideoClub() {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  const categorias = useMemo(() => {
    return Array.isArray(data?.categorias) ? data.categorias : [];
  }, []);

  const playItem = (item) => {
    setError(false);
    setSelected(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reproductor HLS seguro (Chrome/Edge/Android TV)
  useEffect(() => {
    if (!selected?.url) return;

    const video = videoRef.current;
    if (!video) return;

    let hls;

    // Limpieza previa
    try {
      video.pause();
      video.removeAttribute("src");
      video.load();
    } catch {}

    const url = selected.url;

    // Safari / iOS: HLS nativo
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch(() => {});
      return;
    }

    // Chrome/Edge/Android: HLS.js
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 60,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS ERROR:", data);
        // Si es fatal, mostramos error
        if (data?.fatal) {
          setError(true);
          try {
            hls.destroy();
          } catch {}
        }
      });

      return () => {
        try {
          hls.destroy();
        } catch {}
      };
    }

    // Si no soporta HLS.js
    setError(true);
  }, [selected]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800 p-4 flex items-center gap-3">
        <Link to="/home" className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700">
          ⬅ Volver
        </Link>
        <div className="font-black text-xl">
          FABULOSAPLAY{" "}
          <span className="text-xs bg-cyan-400 text-black px-2 py-1 rounded">
            VIDEOCLUB
          </span>
        </div>
      </div>

      {/* Player */}
      {selected && (
        <div className="border-b border-gray-800 bg-black">
          <div className="relative w-full h-[50vh] md:h-[70vh] bg-black">
            <button
              onClick={() => {
                setSelected(null);
                setError(false);
              }}
              className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-bold"
            >
              ✖ CERRAR
            </button>

            {!error ? (
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                className="w-full h-full"
                style={{ background: "black" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-6">
                <div>
                  <div className="text-5xl mb-3">📡</div>
                  <div className="text-xl font-bold text-red-500">No se pudo reproducir</div>
                  <div className="text-gray-400 mt-2">
                    Ese stream está caído, bloqueado por región, o el navegador no soporta el formato.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#0f0f0f] border-t border-gray-800">
            <div className="text-lg font-bold">{selected.titulo}</div>
            <div className="text-xs text-gray-400 break-all">{selected.url}</div>
          </div>
        </div>
      )}

      {/* Catalog */}
      <div className="p-4 md:p-8 space-y-10">
        {categorias.map((cat, idx) => (
          <div key={`${cat.titulo}-${idx}`}>
            <div className="text-lg md:text-xl font-bold mb-4 border-l-4 border-cyan-400 pl-3">
              {cat.titulo}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {(cat.contenido || []).map((item) => (
                <button
                  key={item.id}
                  onClick={() => playItem(item)}
                  className="text-left bg-[#121212] hover:bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-400 transition"
                >
                  <div className="w-full aspect-[2/3] bg-black">
                    <img
                      src={item.poster}
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-bold line-clamp-2">{item.titulo}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {categorias.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            No hay categorías. Revisá <b>src/data/videoclub.json</b>
          </div>
        )}
      </div>
    </div>
  );
}
