import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js'; // Usamos el motor que instalamos hace un rato

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const videoRef = useRef(null); // Referencia al reproductor

  // 1. Cargar la lista de canales
  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((res) => res.json())
      .then((data) => setChannels(data.channels || data.tv_channels || []))
      .catch((err) => console.error("Error cargando JSON:", err));
  }, []);

  // 2. Lógica del Reproductor (HLS + Nativo)
  useEffect(() => {
    // Si no hay canal seleccionado o no hay video en pantalla, no hacemos nada
    if (!selectedChannel || !videoRef.current) return;

    const video = videoRef.current;
    const url = selectedChannel.streamUrl;
    let hls;

    // A: Si el navegador soporta HLS nativo (Safari / Móviles)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(e => console.log("Autoplay bloqueado, usuario debe dar play", e));
    }
    // B: Si es Chrome/Firefox/Windows (Usamos Hls.js)
    else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log("Autoplay bloqueado", e));
      });
    } else {
      console.error("Este navegador no soporta video.");
    }

    // Limpieza al cambiar de canal (para no dejar memoria basura)
    return () => {
      if (hls) hls.destroy();
    };
  }, [selectedChannel]);

  const handlePlayChannel = (channel) => {
    setSelectedChannel(channel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fabulosa" style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', background: '#111', color: 'white' }}>
      
      {/* --- REPRODUCTOR HÍBRIDO (El Potente) --- */}
      <div className="player-section" style={{ marginBottom: '20px', background: '#000', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
        {selectedChannel ? (
          <div>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <video 
                ref={videoRef}
                controls 
                autoPlay 
                playsInline
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                poster={selectedChannel.logoUrl || selectedChannel.logo} // Muestra el logo mientras carga
              />
            </div>
            
            <div style={{ padding: '15px', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{selectedChannel.name}</h3>
              <button 
                onClick={() => setSelectedChannel(null)} 
                style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
              >
                CERRAR
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '50px', textAlign: 'center', border: '1px dashed #444', color: '#888' }}>
            <h2>📺 Toca un logo para ver TV en Vivo</h2>
          </div>
        )}
      </div>

      {/* --- LISTA DE CANALES --- */}
      <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
        {channels.map((channel, index) => (
          <div 
            key={index} 
            onClick={() => handlePlayChannel(channel)}
            style={{ 
              cursor: 'pointer', 
              background: '#1e1e1e', 
              padding: '10px', 
              borderRadius: '10px', 
              textAlign: 'center',
              border: selectedChannel?.name === channel.name ? '2px solid cyan' : '2px solid transparent'
            }}
          >
            <img 
              src={channel.logoUrl || channel.logo} 
              alt={channel.name} 
              style={{ width: '100%', height: '80px', objectFit: 'contain' }}
              onError={(e) => {e.target.style.display='none'}}
            />
            <p style={{ marginTop: '5px', fontSize: '14px' }}>{channel.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channels;