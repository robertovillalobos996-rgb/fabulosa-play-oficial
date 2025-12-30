import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Layout from "./Layout";

// --- TUS PÁGINAS ORIGINALES (Se mantienen) ---
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Channels from "./pages/Channels";
import Live from "./pages/Live";
import Radio from "./pages/Radio";
import PSCInforma from "./pages/PSCInforma";
import Player from "./pages/Player";

// --- LA NUEVA PÁGINA (Agregada) ---
import VideoClub from "./pages/VideoClub"; 

function getPageName(pathname) {
  if (pathname === "/") return "Splash";
  if (pathname.startsWith("/home")) return "Home";
  if (pathname.startsWith("/channels")) return "Channels"; // <-- Tu página de canales sigue aquí
  if (pathname.startsWith("/live")) return "Live";         // <-- Tu página En Vivo sigue aquí
  if (pathname.startsWith("/radio")) return "Radio";       // <-- Tu Radio sigue aquí
  if (pathname.startsWith("/psc")) return "PSCInforma";
  if (pathname.startsWith("/player")) return "Player";
  
  if (pathname.startsWith("/videoclub")) return "VideoClub"; // <-- Nueva lógica
  
  return "Home";
}

export default function App() {
  const location = useLocation();
  const currentPageName = getPageName(location.pathname);

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        {/* --- TUS RUTAS ORIGINALES (Intactas) --- */}
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/live" element={<Live />} />
        <Route path="/radio" element={<Radio />} />
        <Route path="/psc" element={<PSCInforma />} />
        <Route path="/player" element={<Player />} />

        {/* --- NUEVA RUTA VIDEO CLUB --- */}
        <Route path="/videoclub" element={<VideoClub />} />
        
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Layout>
  );
}