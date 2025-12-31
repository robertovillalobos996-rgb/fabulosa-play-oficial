import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import data from "../data/videoclub.json";

export default function VideoClub() {
  const [selected, setSelected] = useState(null); // item actual a reproducir
  const [selectedMeta, setSelectedMeta] = useState(null); // info extra (tipo, etc.)
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos"); // todos | live | vod | series

  const handlePlay = (item, tipo, extraMeta = {}) => {
    setError(false);

    // Si el usuario hace click a una SERIE, abrimos la vista de episodios (no reproducimos aún)
    if (tipo === "series") {
      setSelectedMeta({ tipo, ...extraMeta, serie: item });
      setSelected(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // LIVE o VOD
    setSelected(item);
    setSelectedMeta({ tipo, ...extraMeta });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const playEpisode = (episode, serie, temporadaTitulo) => {
    setError(false);
    setSelected({
      id: episode.id,
      titulo: `${serie.titulo} • ${temporadaTitulo} • ${episode.titulo}`,
      poster: episode.poster || serie.poster,
      url: episode.url,
      duracion: episode.duracion
    });
    setSelectedMeta({
      tipo: "vod", // episodio se trata como VOD
      source: "episode",
      serieTitulo: serie.titulo
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const normalizedCatalog = useMemo(() => {
    // Aplanamos para búsqueda rápida
    const cats = (data?.categorias || []).map((cat) => ({
      ...cat,
      tipo: cat.tipo || "live",
      contenido: (cat.contenido || []).map((item) => ({ ...item }))
    }));
    return cats;
  }, []);

  const filteredCategorias = useMemo(() => {
    const q = search.trim().toLowerCase();

    return normalizedCatalog
      .filter((cat) => (filterTipo === "todos" ? true : cat.tipo === filterTipo))
      .map((cat) => {
        let contenido = cat.contenido;

        if (q) {
          contenido = contenido.filter((item) => {
            const titleMatch = (item.titulo || "").toLowerCase().includes(q);

            // Para series, también buscamos dentro de episodios/temporadas
            if (cat.tipo === "series" && item.temporadas) {
              const deep = item.temporadas.some((t) =>
                (t.episodios || []).some((e) =>
                  (e.titulo || "").toLowerCase().includes(q)
                )
              );
              return titleMatch || deep;
            }

            return titleMatch;
          });
        }

        return { ...cat, contenido };
      })
      .filter((cat) => (cat.contenido || []).length > 0);
  }, [normalizedCatalog, search, filterTipo]);

  const currentTitle = selected?.titulo || (selectedMeta?.tipo === "series" ? (selectedMeta?.serie?.titulo || "") : "");

  const isHls = (url = "") => url.includes(".m3u8");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 font-sans selection:bg-[#00d2ff] selection:text-black">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center gap-6 shadow-2xl">
        <Link
          to="/home"
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all transform hover:scale-105 active:scale-95"
          title="Volver"
        >
          ⬅
        </Link>

        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tighter italic">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">
              FABULOSA
            </span>
            <span className="text-white">PLAY</span>{" "}
            <span className="text-xs align-top bg-[#00d2ff] text-black px-1 rounded font-bold not-italic">
              VIDEO CLUB
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            LIVE 24/7 • Películas • Series
          </p>
        </div>

        {/* Buscador */}
        <div className="hidden md:flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar (pelis, series, episodios)..."
            className="bg-[#111] border border-gray-800 rounded-xl px-4 py-2 text-sm outline-none w-[320px] focus:border-[#00d2ff]"
          />
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-[#111] border border-gray-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00d2ff]"
          >
            <option value="todos">Todo</option>
            <option value="live">LIVE 24/7</option>
            <option value="vod">Películas (VOD)</option>
            <option value="series">Series</option>
          </select>
        </div>
      </div>

      {/* PLAYER / SERIES SELECTOR */}
      {(selected || selectedMeta?.tipo === "series") && (
        <div className="w-full bg-black sticky top-[76px] z-40 shadow-2xl border-b border-gray-800 animate-fade-in">
          <div className="max-w-[1900px] mx-auto relative">
            <button
              onClick={() => {
                setSelected(null);
                setSelectedMeta(null);
                setError(false);
              }}
              className="absolute top-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-2xl transition-all hover:scale-110 flex items-center gap-2"
            >
              <span>✖</span> CERRAR
            </button>

            {/* Si hay un video seleccionado, mostramos reproductor */}
            {selected ? (
              <div className="relative aspect-video h-[50vh] md:h-[80vh] bg-black">
                {!error ? (
                  <ReactPlayer
                    url={selected.url}
                    width="100%"
                    height="100%"
                    playing={true}
                    controls={true}
                    playsinline={true}
                    config={{
                      file: {
                        // Si es m3u8 forzamos HLS, si es mp4 no hace falta
                        forceHLS: isHls(selected.url),
                        attributes: {
                          style: {
                            height: "100%",
                            width: "100%",
                            objectFit: "contain"
                          }
                        }
                      }
                    }}
                    onError={() => setError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] text-center p-6">
                    <span className="text-6xl mb-4">📡</span>
                    <h3 className="text-2xl font-bold text-red-500">Señal interrumpida</h3>
                    <p className="text-gray-400 mt-2">
                      Puede ser enlace caído o CORS. Probá otro contenido.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Si es una serie (y aún no eligió episodio), mostramos panel de episodios */
              <div className="p-6 md:p-8 bg-[#0b0b0b]">
                <div className="flex gap-6 flex-col md:flex-row">
                  <img
                    src={selectedMeta?.serie?.poster}
                    alt={selectedMeta?.serie?.titulo}
                    className="w-full md:w-[260px] aspect-[2/3] object-cover rounded-2xl border border-gray-800"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="flex-1">
                    <h2 className="text-3xl font-black">{selectedMeta?.serie?.titulo}</h2>
                    <p className="text-gray-400 mt-2 max-w-3xl">
                      {selectedMeta?.serie?.descripcion || "Seleccioná una temporada y un episodio para reproducir."}
                    </p>

                    <div className="mt-6 space-y-8">
                      {(selectedMeta?.serie?.temporadas || []).map((temp, tIndex) => (
                        <div key={tIndex}>
                          <h3 className="text-xl font-bold mb-4 text-white border-l-4 border-[#00d2ff] pl-4">
                            {temp.titulo || `Temporada ${tIndex + 1}`}
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(temp.episodios || []).map((ep) => (
                              <button
                                key={ep.id}
                                onClick={() => playEpisode(ep, selectedMeta.serie, temp.titulo || `Temporada ${tIndex + 1}`)}
                                className="text-left group bg-[#111] hover:bg-[#151515] border border-gray-800 rounded-2xl overflow-hidden transition-all"
                              >
                                <div className="flex gap-4 p-4">
                                  <img
                                    src={ep.poster || selectedMeta?.serie?.poster}
                                    alt={ep.titulo}
                                    className="w-24 h-16 object-cover rounded-xl border border-gray-800"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                  />
                                  <div className="flex-1">
                                    <p className="font-bold text-gray-200 group-hover:text-[#00d2ff]">
                                      {ep.titulo}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {ep.duracion || ""} {ep.duracion ? "•" : ""} Click para reproducir
                                    </p>
                                  </div>
                                  <div className="self-center bg-[#00d2ff] text-black w-10 h-10 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,210,255,0.6)] transform group-hover:scale-110 transition-transform">
                                    ▶
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata abajo cuando hay video */}
          {selected && (
            <div className="p-6 bg-[#111]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                {currentTitle}
              </h2>
              <p className="text-gray-500 text-sm mt-1 ml-6">
                {selectedMeta?.tipo === "live" ? "En Vivo •" : "A la carta •"}{" "}
                {selected?.duracion ? `Duración ${selected.duracion} • ` : ""}
                Calidad HD
              </p>
            </div>
          )}
        </div>
      )}

      {/* CONTROLES MOBILE */}
      <div className="md:hidden px-4 pt-6 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00d2ff]"
        />
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="w-full bg-[#111] border border-gray-800 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#00d2ff]"
        >
          <option value="todos">Todo</option>
          <option value="live">LIVE 24/7</option>
          <option value="vod">Películas (VOD)</option>
          <option value="series">Series</option>
        </select>
      </div>

      {/* CATÁLOGO TIPO NETFLIX */}
      <div className="px-4 md:px-8 py-10 space-y-14 max-w-[2000px] mx-auto">
        {filteredCategorias.map((cat, i) => (
          <div key={i}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="text-xl m
