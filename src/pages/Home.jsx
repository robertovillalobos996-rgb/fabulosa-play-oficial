import React, { useState, useRef, useEffect } from 'react';
import ChatLive from '../ChatLive'; 

export default function Home() {
  const [status, setStatus] = useState('SISTEMA STANDBY');
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [promoIndex, setPromoIndex] = useState(1);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const particles = useRef([]);

  // --- MOTOR DE PARTÍCULAS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        if (p.shockwave) {
          p.radius += 15; p.life -= 0.02;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.life})`;
          ctx.lineWidth = 2;
          ctx.arc(canvas.width / 2, canvas.height / 2, p.radius, 0, Math.PI * 2);
          ctx.stroke();
          if (p.life <= 0) particles.current.splice(i, 1);
          continue;
        }
        p.x += p.vx; p.y += p.vy; p.life -= 0.01;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.current.splice(i, 1);
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  const triggerExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const color = isActive ? "#ff2a2a" : "#4facfe";
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.current.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: Math.random() * 3, life: 1, color: color });
    }
    particles.current.push({ shockwave: true, radius: 0, life: 1 });
  };

  const handleToggle = () => {
    triggerExplosion();
    if (!isActive) {
      setStatus('EN VIVO');
      audioRef.current.play().then(() => setIsActive(true)).catch(() => setStatus('ERROR'));
    } else {
      audioRef.current.pause();
      setIsActive(false);
      setStatus('STANDBY');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setPromoIndex(p => p >= 5 ? 1 : p + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center font-mono selection:bg-red-500">
      <div className="cinema-bg"></div>
      
      <header className="py-6 z-10">
        <img src="/logos/logo.png" className="h-20 object-contain drop-shadow-[0_0_20px_red]" alt="Logo" />
      </header>

      <main className="w-full max-w-6xl px-4 space-y-8 pb-10 z-10">
        
        {/* 1. CANAL DE TV (RECUPERADO) */}
        <div className="w-full aspect-video bg-black rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative">
          <iframe 
            src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/embed.html" 
            className="w-full h-full" 
            frameBorder="0" allowFullScreen
          ></iframe>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* 2. RADIO NUCLEO (EL EFECTO) */}
          <div 
            onClick={handleToggle}
            className={`relative min-h-[400px] bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-700 ${isActive ? 'shadow-[0_0_80px_#4facfe]' : 'shadow-[0_0_40px_#ff2a2a]'}`}
          >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
            <div className={`text-6xl font-black mb-4 ${isActive ? 'text-cyan-400' : 'text-red-600'}`}>
              {isActive ? 'ONLINE' : 'OFFLINE'}
            </div>
            <div className="text-[10px] tracking-[0.5em] opacity-40">{status}</div>
            
            <div className="mt-8 w-full max-w-xs px-4">
              <input type="range" min="0" max="1" step="0.01" value={volume} 
                onChange={(e) => { setVolume(e.target.value); audioRef.current.volume = e.target.value; }}
                className="w-full accent-red-600" onClick={(e) => e.stopPropagation()} 
              />
            </div>
            <audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
          </div>

          {/* 3. CHAT LIVE (RECUPERADO) */}
          <div className="h-[500px] bg-[#0b141a] rounded-[2.5rem] border border-white/5 overflow-hidden">
            <ChatLive />
          </div>
        </div>

        {/* 4. PUBLICIDAD (RECUPERADA) */}
        <div className="w-full aspect-[21/9] bg-black/40 rounded-3xl overflow-hidden border border-white/10">
           <img 
             src={`/publicidad/promo${promoIndex}.jpg`} 
             className="w-full h-full object-contain transition-opacity duration-1000"
             onError={(e) => e.target.src = "/publicidad/promo1.jpg"}
           />
        </div>

      </main>
    </div>
  );
}