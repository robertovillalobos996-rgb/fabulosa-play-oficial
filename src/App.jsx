import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Home from "./pages/Home";
import VideoClub from "./pages/VideoClub";
import Channels from "./pages/Channels";
import Radio from "./pages/Radio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Inicio */}
        <Route path="/" element={<Home />} />

        {/* Video Club */}
        <Route path="/videoclub" element={<VideoClub />} />

        {/* Canales TV */}
        <Route path="/channels" element={<Channels />} />

        {/* Radio */}
        <Route path="/radio" element={<Radio />} />

        {/* Si alguien entra a /envivo y no existe, lo manda a inicio */}
        <Route path="/envivo" element={<Navigate to="/" replace />} />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
