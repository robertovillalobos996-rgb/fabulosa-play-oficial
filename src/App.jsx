import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ Importa SOLO lo que estás seguro que existe
import Home from "./pages/Home";
import Channels from "./pages/Channels";
import Radio from "./pages/Radio";
import VideoClub from "./pages/VideoClub";

// ✅ EnVivo seguro (sin importar archivo externo)
// (Luego, si tenés EnVivo.jsx real, te digo cómo activarlo bien)
function EnVivo() {
  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>En Vivo</h2>
      <p>
        Página En Vivo temporal. (Tu import de EnVivo estaba fallando y por eso se
        iba a pantalla negra.)
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Páginas */}
        <Route path="/home" element={<Home />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/radio" element={<Radio />} />
        <Route path="/envivo" element={<EnVivo />} />
        <Route path="/videoclub" element={<VideoClub />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
