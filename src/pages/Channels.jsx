import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Cargar canales desde el JSON
  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((response) => response.json())
      .then((data) => setChannels(data.channels || data.tv_channels || []))
      .catch((err) => console.error("Error cargando canales:", err));
  }, []);

  const handlePlayChannel = (channel) => {
    setSelectedChannel(channel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestSystem = () => {
    setSelectedChannel({
      name: "Prueba de Sistema (Video Seguro)",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fabulosa" style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', background: '#111', color: 'white' }}>
      
      {/* --- REPRODUCTOR --- */}
      <div className="player-section" style={{ marginBottom: '20px', background: '#000', borderRadius: '10px', overflow: 'hidden' }}>
        {selectedChannel ? (
          <div>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <ReactPlayer 
                url={selectedChannel.streamUrl}
                playing={true}        // Intentar autoejecutar
                muted={true}          // <--- ESTA ES LA CLAVE: Arrancar en silencio
                controls={true}       // Mostrar barra de tiempo y volumen
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{ file: { forceHLS: true } }}
                onError={(e) => console.log("Error de reproducción:", e)}
              />
            </div>
            
            <div style={{ padding: '15px', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{selectedChannel.name}</h3>
              <button 
                onClick={() => setSelectedChannel(null)} 
                style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
            {/* Aviso de silencio */}
            <div style={{ padding: '5px', background: '#0288d1', fontSize: '12px', textAlign: 'center' }}>
              🔊 El video inicia en silencio por seguridad. Súbele volumen.
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #444' }}>
            <h2>📺 Selecciona un canal</h2>
            <button 
              onClick={handleTestSystem}
              style={{ background: '#ffcc00', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              ⚠️ PROBAR REPRODUCTOR
            </button>
          </div>
        )}
      </div>

      {/* --- LISTA DE CANALES --- */}
      <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
        {channels.map((channel, index) => (
          <div 
            key={index} 
            onClick={() => handlePlayChannel(channel)}
            style={{ cursor: 'pointer', background: '#1e1e1e', padding: '10px', borderRadius: '10px', textAlign: 'center' }}
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