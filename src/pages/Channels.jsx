import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player'; // Asegúrate de tener instalado react-player

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null); // Aquí guardamos el canal activo
  const [error, setError] = useState(null);

  // 1. CARGA DE DATOS (Fetch del JSON)
  useEffect(() => {
    fetch('/data/fabulosa-data.json') // Ruta absoluta a la carpeta public
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo JSON');
        }
        return response.json();
      })
      .then((data) => {
        // Validamos si viene como 'channels' o 'tv_channels' según tu estructura
        setChannels(data.channels || data.tv_channels || []);
      })
      .catch((err) => {
        console.error("Error cargando canales:", err);
        setError("Error cargando la lista de canales.");
      });
  }, []);

  // 2. FUNCIÓN PARA REPRODUCIR (Evita el error 404)
  const handlePlayChannel = (channel) => {
    console.log("Reproduciendo:", channel.name, channel.streamUrl);
    // En lugar de navegar a una ruta rota, actualizamos el estado
    setSelectedChannel(channel);
    
    // Opcional: Si quieres que scrollee hacia arriba al reproductor
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fabulosa">
      
      {/* --- SECCIÓN DEL REPRODUCTOR --- */}
      {selectedChannel ? (
        <div className="player-wrapper" style={{ marginBottom: '20px', background: '#000' }}>
          <h3>Viendo: {selectedChannel.name}</h3>
          <ReactPlayer 
            url={selectedChannel.streamUrl} // USA LA URL DIRECTA DEL JSON
            playing={true}
            controls={true}
            width="100%"
            height="auto"
            onError={(e) => console.error("Error en el player:", e)}
          />
          <button onClick={() => setSelectedChannel(null)} style={{marginTop: '10px'}}>
            Cerrar Reproductor
          </button>
        </div>
      ) : (
        <div className="hero-section">
          <h2>Selecciona un canal para ver en vivo</h2>
        </div>
      )}

      {/* --- LISTA DE CANALES --- */}
      <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {channels.map((channel, index) => (
          <div 
            key={index} 
            className="channel-card" 
            onClick={() => handlePlayChannel(channel)} // CLICK CORRECTO
            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}
          >
            {/* LOGOS: Usamos la ruta directa del JSON */}
            <img 
              src={channel.logoUrl || channel.logo} 
              alt={channel.name} 
              style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              onError={(e) => {e.target.src = '/logos/default.png'}} // Fallback si falla el logo
            />
            <p>{channel.name}</p>
          </div>
        ))}
      </div>

      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default Channels;