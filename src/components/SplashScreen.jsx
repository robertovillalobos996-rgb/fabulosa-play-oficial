import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { 
          clearInterval(interval); 
          setTimeout(onFinish, 1200); // Pausa dramática al final
          return 100; 
        }
        return p + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#000] z-[999] flex flex-col items-center justify-center overflow-hidden">
      {/* FONDO DE PARTÍCULAS EN MOVIMIENTO */}
      <div className="absolute inset-0 bg-energy-grid opacity-20"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* LOGO CON EFECTO DE ZOOM Y ENERGÍA */}
        <div className="relative group animate-intro-zoom">
          <img 
            src="/logos/logo.png" 
            className="h-48 md:h-72 object-contain logo-energy-glow" 
            alt="Fabulosa Play" 
          />
          {/* Anillo de energía circular */}
          <div className="absolute inset-0 rounded-full border-2 border-red-600 animate-ping-slow opacity-30"></div>
        </div>

        <div className="mt-12 space-y-4 text-center">
          <h1 className="text-candy-perlado text-4xl md:text-6xl font-black italic tracking-widest animate-text-flicker">
            FABULOSA PLAY
          </h1>
          
          {/* BARRA DE CARGA ESTILO "SISTEMA OPERATIVO FUTURISTA" */}
          <div className="relative w-80 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10 mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-red-950 via-red-600 to-white shadow-[0_0_20px_#ff0000] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between w-80 mx-auto">
            <span className="text-red-500 text-[9px] font-bold tracking-[0.3em] uppercase">System Boot</span>
            <span className="text-white text-[9px] font-mono">{progress}%</span>
          </div>
        </div>
      </div>

      {/* EFECTO DE FLASH FINAL */}
      {progress === 100 && <div className="absolute inset-0 bg-white animate-flash-out z-[1000]"></div>}
    </div>
  );
};

export default SplashScreen;