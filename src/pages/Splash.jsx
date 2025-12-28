import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { createPageUrl } from "../utils/createPageUrl";

export default function Splash() {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl("Home"));
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleEnableAudio = () => {
    setShowButton(false);
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = currentSrc.replace("mute=1", "mute=0");
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "black", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {showButton && (
        <Button
          onClick={handleEnableAudio}
          className="absolute top-20 z-[10000] bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white px-8 py-6 text-xl font-bold shadow-2xl shadow-fuchsia-500/50"
        >
          <Volume2 className="w-8 h-8 mr-3" />
          ACTIVAR SONIDO
        </Button>
      )}

      <iframe
        ref={iframeRef}
        src="https://www.youtube.com/embed/UJlzeZLOfBY?autoplay=1&controls=0&rel=0&modestbranding=1&showinfo=0&mute=1&loop=0"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
