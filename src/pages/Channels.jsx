import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [playerError, setPlayerError] = useState(null); // Nuevo: Para ver el error en pantalla

  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((response) => response.json())
      .then((data) => setChannels(data.channels || data.tv_channels || []))
      .catch((err) => console.error("Error cargando canales:", err));
  }, []);

  const handlePlayChannel = (channel) => {
    setPlayerError(null); // Limpiar errores previos
    setSelectedChannel(channel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fabulosa" style={{ padding: '20px', paddingBottom: '80px', position: 'relative' }}>
      
      {/* REPRODUCTOR */}
      <div className="player-section" style={{ marginBottom: '30px', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
        {selectedChannel ? (
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <ReactPlayer 
              url={selectedChannel.streamUrl}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              // CONFIGURACIÓN CLAVE PARA TV EN VIVO (HLS)
              config={{
                file: {
                  forceHLS: true, 
                  attributes: { controlsList: 'nodownload' }
                }
              }}
              // DETECTAR ERROR
              onError={(e) => {
                console.error("Error player:", e);
                setPlayerError("No se pudo reproducir. Posible bloqueo HTTP o enlace roto.");
              }}
            />
            
            {/* MENSAJE DE ERROR EN PANTALLA */}
            {playerError && (
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, textAlign: 'center', color: 'red', background: 'rgba(0,0,0,0.8)', padding: '20px' }}>
                ⚠️ {playerError} <br/>
                <small>Intenta con un canal HTTPS</small>
              </div>
            )}

            <div style={{ padding: '10px', background: '#222', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
              <span>{selectedChannel.name}</span>
              <button onClick={() => setSelectedChannel(null)} style={{ color: 'red' }}>Cerrar ✖</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>
            <h2>📺 Toca un canal para ver</h2>
          </div>
        )}
      </div>

      {/* LISTA DE CANALES */}
      <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', position: 'relative', zIndex: 5 }}>
        {channels.map((channel, index) => (
          <div 
            key={index} 
            onClick={() => handlePlayChannel(channel)}
            style={{ cursor: 'pointer', background: '#1a1a1a', padding: '10px', borderRadius: '10px', textAlign: 'center' }}
          >
            <img src={channel.logoUrl || channel.logo} alt={channel.name} style={{ width: '100%', height: '80px', objectFit: 'contain' }} onError={(e) => {e.target.style.display='none'}} />
            <p style={{ color: 'white', marginTop: '5px' }}>{channel.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channels;