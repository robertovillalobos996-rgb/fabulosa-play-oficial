import React, { useState, useEffect } from 'react';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [log, setLog] = useState("Esperando pruebas...");

  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((res) => res.json())
      .then((data) => setChannels(data.channels || data.tv_channels || []))
      .catch((err) => setLog("Error cargando JSON: " + err.message));
  }, []);

  const handleTestMP4 = () => {
    setLog("Cargando video MP4...");
    setSelectedChannel({
      name: "VIDEO DE PRUEBA (MP4)",
      streamUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
      type: 'video/mp4'
    });
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ background: 'black', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <h2 style={{color: '#ffd700'}}>PRUEBA DE VIDEO NATIVA</h2>
      <div style={{ background: '#333', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
        📢 ESTADO: <strong>{log}</strong>
      </div>

      {/* --- BOTÓN DE PRUEBA INFALIBLE --- */}
      <button 
        onClick={handleTestMP4}
        style={{ width: '100%', padding: '15px', background: 'cyan', color: 'black', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px', border: 'none', cursor: 'pointer' }}
      >
        CLICK AQUÍ: PROBAR VIDEO MP4
      </button>

      {/* --- REPRODUCTOR HTML5 PURO (Sin Librerías) --- */}
      {selectedChannel && (
        <div style={{ border: '2px solid red', padding: '10px', marginBottom: '20px' }}>
          <h3>Viendo: {selectedChannel.name}</h3>
          {/* Etiqueta VIDEO estándar de HTML */}
          <video 
            key={selectedChannel.streamUrl} // Esto fuerza a recargar si cambia el canal
            controls 
            autoPlay 
            playsInline
            style={{ width: '100%', height: 'auto', background: '#000' }}
            src={selectedChannel.streamUrl}
            onPlay={() => setLog("¡ÉXITO! El video se está reproduciendo.")}
            onError={(e) => setLog("FALLÓ: El navegador no pudo cargar el video.")}
          >
            Tu navegador no soporta video HTML5.
          </video>
          <button onClick={() => setSelectedChannel(null)} style={{marginTop: '10px', padding: '10px'}}>CERRAR</button>
        </div>
      )}

      {/* --- LISTA CANALES --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {channels.map((c, i) => (
          <button key={i} onClick={() => setSelectedChannel(c)} style={{ padding: '10px', background: '#222', color: 'white', border: '1px solid #444' }}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Channels;