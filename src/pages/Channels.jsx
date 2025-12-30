import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null); // Para mostrar si falla un canal
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // Para guardar la referencia del motor HLS

  // 1. Cargar canales
  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((res) => res.json())
      .then((data) => setChannels(data.channels || data.tv_channels || []))
      .catch((err) => console.error("Error JSON:", err));
  }, []);

  // 2. Lógica del Reproductor HLS
  useEffect(() => {
    if (!selectedChannel) return;

    setErrorMsg(null); // Limpiar errores al cambiar de canal
    const video = videoRef.current;
    const url = selectedChannel.streamUrl;

    // Verificar si es HTTP (Inseguro) en lugar de HTTPS
    if (url.startsWith('http:')) {
      setErrorMsg("⚠️ Bloqueo de seguridad: Este canal usa 'http' inseguro. Vercel requiere 'https'.");
    }

    const handleError = () => {
      // Si ya detectamos que es HTTP, no sobreescribir el mensaje
      if (!url.startsWith('http:')) {
        setErrorMsg("⚠️ Señal no disponible o caída momentáneamente.");
      }
    };

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy(); // Limpiar anterior

      const hls = new Hls();
      hlsRef.current = hls;
      
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => console.log("Autoplay bloqueado (normal)"));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("Error fatal HLS:", data);
          handleError();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Para iPhone/Safari
      video.src = url;
      video.play();
      video.addEventListener('error', handleError);
    }

    // Limpieza al desmontar
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [selectedChannel]);

  const handlePlayChannel = (channel) => {
    setSelectedChannel(channel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fabulosa" style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', background: '#111', color: 'white' }}>
      
      {/* --- REPRODUCTOR --- */}
      <div className="player-section" style={{ marginBottom: '30px', background: '#000', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.5)' }}>
        {selectedChannel ? (
          <div style={{ position: 'relative' }}>
            {/* Contenedor Video 16:9 */}
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <video 
                ref={videoRef}
                controls 
                autoPlay 
                playsInline
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
              />
              
              {/* Mensaje de Error sobre el video */}
              {errorMsg && (
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                  background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', 
                  justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' 
                }}>
                  <h3 style={{ color: '#ff4444', marginBottom: '10px' }}>{errorMsg}</h3>
                  <a href={selectedChannel.streamUrl} target="_blank" rel="noreferrer" style={{ color: '#4facfe', textDecoration: 'underline' }}>
                    Intentar abrir enlace directo
                  </a>
                </div>
              )}
            </div>
            
            <div style={{ padding: '15px', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedChannel.name}</h3>
              <button 
                onClick={() => setSelectedChannel(null)} 
                style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                CERRAR
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
            <h2>📺 Selecciona un canal</h2>
          </div>
        )}
      </div>

      {/* --- LISTA DE CANALES CON MOVIMIENTO --- */}
      <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
        {channels.map((channel, index) => (
          <div 
            key={index} 
            onClick={() => handlePlayChannel(channel)}
            className="channel-card"
            style={{ 
              cursor: 'pointer', 
              background: '#1e1e1e', 
              padding: '15px', 
              borderRadius: '15px', 
              textAlign: 'center',
              transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease', // SUAVIZADO
              border: selectedChannel?.name === channel.name ? '2px solid #00d2ff' : '2px solid transparent'
            }}
            // Eventos para el efecto de movimiento (Hover)
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-5px)'; // Aumenta tamaño y sube
              e.currentTarget.style.background = '#2a2a2a';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)'; // Vuelve a normal
              e.currentTarget.style.background = '#1e1e1e';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img 
              src={channel.logoUrl || channel.logo} 
              alt={channel.name} 
              style={{ width: '100%', height: '90px', objectFit: 'contain', marginBottom: '10px' }}
              onError={(e) => {e.target.style.display='none'}}
            />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{channel.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channels;