import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio } from 'lucide-react';
import ChatLive from '../ChatLive';
export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [promoIndex, setPromoIndex] = useState(1);
  const audioRef = useRef(null);
  useEffect(() => {
    const timer = setInterval(() => setPromoIndex(p => (p >= 5 ? 1 : p + 1)), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <header className="py-8"><img src="/logos/logo.png" className="h-24" /></header>
      <main className="w-full max-w-6xl px-4 space-y-10">
        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
          <iframe src="https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/embed.html" className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-10 rounded-3xl flex flex-col items-center justify-center">
            <Radio size={80} /><audio ref={audioRef} src="https://dattavolt.com/8030/stream" />
          </div>
          <div className="h-[500px] bg-[#0b141a] rounded-3xl overflow-hidden"><ChatLive /></div>
        </div>
        <div className="w-full h-64 bg-black rounded-3xl overflow-hidden"><img src={`/publicidad/promo${promoIndex}.jpg`} className="w-full h-full object-contain" /></div>
      </main>
    </div>
  );
}
