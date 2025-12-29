import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((response) => response.json())
      .then((data) => setChannels(data.channels || data.tv_channels || []))
      .catch((err) => console.error("Error:", err));
  }, []);

  const handlePlayChannel = (channel) => {
    // 1. ALERTA VISUAL PARA CONFIRMAR CLIC
    // alert(`Click detectado: ${channel.name}`); 
    setSelectedChannel(channel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestMP4 = () => {
    setSelectedChannel({
      name: "Prueba MP4 (Video Normal)",
      streamUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4", // Este NO es HLS, debe funcionar sí o sí
      isTv: false
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
                playing={true}
                muted={true} // Silencio para permitir autoplay
                controls={true}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                onError={(e) => console.log("Error fatal del player:", e)}
              />
            </div>
            
            <div style={{ padding: '15px', background: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{selectedChannel.name}</h3>
              <button onClick={() => setSelectedChannel(null)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>CERRAR</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed #444' }}>
            <h2>Selecciona un canal</h2>
            
            {/* BOTÓN PRUEBA 1: TV (M3U8) */}
            <button 
              onClick={() => handlePlayChannel({ name: "Prueba TV (M3U8)", streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" })}
              style={{ background: '#ffcc00', color: 'black', border: 'none', padding: '10px', margin: '5px', cursor: 'pointer' }}
            >
              ⚠️ PRUEBA TV (HLS)
            </button>

            {/* BOTÓN PRUEBA 2: VIDEO NORMAL (MP4) */}
            <button 
              onClick={handleTestMP4}
              style={{ background: '#00ccff', color: 'black', border: 'none', padding: '10px', margin: '5px', cursor: 'pointer' }}
            >
              🎥 PRUEBA VIDEO NORMAL (MP4)
            </button>
            
            <p style={{fontSize:'12px', color:'#aaa'}}>Si el Azul funciona pero el Amarillo no, falta configurar HLS.</p>
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
            <img src={channel.logoUrl || channel.logo} alt={channel.name} style={{ width: '100%', height: '80px', objectFit: 'contain' }} onError={(e) => {e.target.style.display='none'}}/>
            <p>{channel.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channels;