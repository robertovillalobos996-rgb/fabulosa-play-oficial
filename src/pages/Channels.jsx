import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [error, setError] = useState(null);

  // --- 1. CARGA DE DATOS ---
  useEffect(() => {
    fetch('/data/fabulosa-data.json')
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
        return response.json();
      })
      .then((data) => {
        setChannels(data.channels || data.tv_channels || []);
      })
      .catch((err) => {
        console.error("Error cargando canales:", err);
        setError("Error cargando la lista de canales.");
      });
  }, []);

  // --- 2. FUNCIÓN AL HACER CLIC ---
  const handlePlayChannel = (channel) => {
    console.log("Reproduciendo:", channel.name);
    setSelectedChannel(channel);
    // Desplazar suavemente hacia el reproductor
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fabulosa" style={{ padding: '20px', paddingBottom: '80px', position: 'relative' }}>
      
      {/* --- SECCIÓN DEL REPRODUCTOR (Corregida) --- */}
      <div 
        className="player-section" 
        style={{ 
          marginBottom: '30px', 
          background: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          // Aseguramos que no bloquee nada más
          position: 'relative',
          zIndex: 10
        }}
      >
        {selectedChannel ? (
          <div style={{ position: 'relative', paddingTop: '56.25%' /* Player ratio 16:9 */ }}>
            <ReactPlayer 
              url={selectedChannel.streamUrl}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              onError={(e) => console.error("Error en el player:", e)}
            />
            <div style={{ padding: '15px', background: '#222', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Viendo: {selectedChannel.name}</h3>
              <button 
                onClick={() => setSelectedChannel(null)} 
                style={{ padding: '8px 15px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Cerrar X
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>
            <h2>📺 Selecciona un canal de la lista para comenzar</h2>
          </div>
        )}
      </div>

      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

      {/* --- LISTA DE CANALES (Corregida) --- */}
      <div 
        className="channels-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '25px',
          // Aseguramos que esté en una capa interactiva
          position: 'relative',
          zIndex: 5
        }}
      >
        {channels.map((channel, index) => (
          <div 
            key={index} 
            className="channel-card" 
            onClick={() => handlePlayChannel(channel)}
            style={{ 
              cursor: 'pointer', 
              background: '#1a1a1a',
              padding: '15px', 
              borderRadius: '15px', 
              textAlign: 'center',
              transition: 'transform 0.2s, background 0.2s', // Efecto de movimiento
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              border: '2px solid transparent'
            }}
            // Añadimos efectos hover con eventos de mouse
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = '#2a2a2a';
              e.currentTarget.style.borderColor = '#ff00ff'; // Color de acento Fabulosa
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <img 
              src={channel.logoUrl || channel.logo} 
              alt={channel.name} 
              style={{ width: '100%', height: '100px', objectFit: 'contain', marginBottom: '10px' }}
              onError={(e) => {e.target.style.display = 'none'}} 
            />
            <p style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>{channel.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channels;