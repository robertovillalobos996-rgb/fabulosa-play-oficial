import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Hls from "hls.js";
import data from "../data/videoclub.json";

function normalizeCategories(raw) {
  // Acepta:
  // 1) { categorias: [...] }
  // 2) { videoclub: { categorias: [...] } }
  // 3) { videoclub: { categories: [...] } }
  const cats =
    raw?.categorias ??
    raw?.videoclub?.categorias ??
    raw?.videoclub?.categories ??
    [];

  // Normaliza campos a formato español
  return (cats || []).map((c) => {
    const items = c.items ?? c.items ?? [];
    return {
      id: c.id,
      titulo: c.titulo ?? c.title ?? "Categoría",
      items: (items || []).map((it) => ({
        id: it.id,
        titulo: it.titulo ?? it.title ?? "Canal",
        descripcion: it.descripcion ?? it.description ?? "",
        stream_url: it.stream_url ?? it.streamUrl ?? it.url ?? "",
        tipo: it.tipo ?? it.type ?? "LIVE",
        idioma: it.idioma ?? it.language ?? "",
        fuente: it.fuente ?? it.source ?? "",
        poster: it.poster ?? ""
      }))
    };
  });
}

export default function VideoClub() {
  const categorias = useMemo(() => normalizeCategories(data), []);
  const [selected, setSelected] = useState(null);

  // Refs del video
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Limpieza HLS
  const destroyHls = () => {
    try {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    } catch (e) {}
  };

  // Cargar stream (HLS)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    destroyHls();

    if (!selected?.stream_url) return;

    const url = selected.stream_url;

    // iOS Safari reproduce HLS nativo
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch(() => {});
      return;
    }

    // HLS.js (Chrome/Edge/Firefox)
    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 30
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        // Si el stream cae, no rompe la app
        console.log("HLS error:", data);
      });
    } else {
      // Último recurso
      video.src = url;
      video.play().catch(() => {});
    }

    return () => destroyHls();
  }, [selected]);

  // Si está vacío, mostramos mensaje SIEMPRE (aunque Tailwind no cargue)
  if (!categorias.length) {
    return (
      <div style={{ minHeight: "100vh", background: "#070711", color: "#fff", padding: 24 }}>
        <h2 style={{ marginBottom: 10 }}>No hay categorías.</h2>
        <p>Revisá <b>src/data/videoclub.json</b> (estructura).</p>
        <div style={{ marginTop: 16 }}>
          <Link to="/" style={{ color: "#ff4fd8", textDecoration: "underline" }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          ← Volver
        </Link>

        <div className="text-lg font-semibold tracking-wide">
          FABULOSAPLAY <span className="ml-2 px-2 py-1 text-xs rounded bg-cyan-500/20 text-cyan-200">VIDEOCLUB</span>
        </div>
      </div>

      {/* Player */}
      <div className="mb-6">
        <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
          <div className="p-3 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm text-white/60">Reproduciendo</div>
              <div className="font-semibold">
                {selected?.titulo ? selected.titulo : "Seleccioná un canal"}
              </div>
              {selected?.descripcion ? (
                <div className="text-sm text-white/60">{selected.descripcion}</div>
              ) : null}
            </div>
            {selected?.idioma || selected?.fuente ? (
              <div className="text-sm text-white/60">
                {selected?.fuente ? <span className="mr-3">Fuente: {selected.fuente}</span> : null}
                {selected?.idioma ? <span>Idioma: {selected.idioma}</span> : null}
              </div>
            ) : null}
          </div>

          <video
            ref={videoRef}
            controls
            playsInline
            style={{ width: "100%", maxHeight: 420, background: "#000" }}
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="space-y-8">
        {categorias.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-cyan-400 rounded" />
              <h3 className="text-lg font-semibold">{cat.titulo}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="text-left rounded-xl p-4 bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  <div className="font-semibold">{item.titulo}</div>
                  {item.descripcion ? (
                    <div className="text-sm text-white/60 mt-1">{item.descripcion}</div>
                  ) : null}
                  <div className="text-xs text-white/50 mt-3">
                    {item.fuente ? <span className="mr-3">Fuente: {item.fuente}</span> : null}
                    {item.idioma ? <span>Idioma: {item.idioma}</span> : null}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
