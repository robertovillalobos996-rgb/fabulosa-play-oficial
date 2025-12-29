import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Cargar canales
  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((response) => response.json())
      .then((data) => setChannels(data.channels || data.tv_channels || []))
      .catch((err) => console.error("Error:", err));
  }, []);

  // Función para reproducir un canal de tu lista
  const handlePlayChannel = (channel) => {
    setSelectedChannel(channel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para PROBAR si el sistema funciona (Video de prueba seguro)
  const handleTestSystem = () => {
    setSelectedChannel({
      name: "Prueba de Sistema (Si ves esto, el player funciona)",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" // Enlace HTTPS garantizado
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fabulosa" style={{ padding: '20px', paddingBottom: '80px', color: 'white' }}>
      
      {/* --- REPRODUCTOR --- */}
      <div className="player-section" style={{ marginBottom: '20px', background: '#000', borderRadius: '10px', overflow: 'hidden' }}>
        {selectedChannel ? (
          <div>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <ReactPlayer 
                url={selectedChannel.streamUrl}
                playing={true}
                controls={true}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{ file: { forceHLS: true } }}
                onError={(e) => console.log("Error de reproducción:", e)}
              />
            </div>
            <div style={{ padding: '15px', background: '#222', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{selectedChannel.name}</h3>
              <button onClick={() => setSelectedChannel(null)} style={{ color: 'red', fontWeight: 'bold' }}>CERRAR X</button>
            </div>
            {/* Aviso si es canal HTTP */}
            {selectedChannel.streamUrl.startsWith('http:') && (
              <div style={{ padding: '10px', background: '#500', color: '#fff', fontSize: '12px', textAlign: 'center' }}>
                ⚠️ OJO: Este canal usa 'http'. Es probable que no se vea en Vercel. <br/>
                Necesitas enlaces 'https'.
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed #444' }}>
            <h2>Selecciona un canal</h2>
            {/* BOTÓN DE PRUEBA */}
            <button 
              onClick={handleTestSystem}
              style={{ background: '#ffcc00', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              ⚠️ PROBAR REPRODUCTOR (Click aquí)
            </button>
            <p style={{fontSize: '12px', color: '#aaa', marginTop: '5px'}}>Si este botón funciona, el problema son los links de tus canales.</p>
          </div>
        )}
      </div>

      {/* --- LISTA DE CANALES --- */}
      <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
        {channels.map((channel, index) => (
          <div 
            key={index} 
            onClick={() => handlePlayChannel(channel)}
            style={{ cursor: 'pointer', background: '#1a1a1a', padding: '10px', borderRadius: '10px', textAlign: 'center' }}
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