import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Radio, MessageCircle, Tv } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-white/10 p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-8">Fabulosa</h1>
        <nav className="space-y-4">
          <Link to="/home" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded"><Home/> Inicio</Link>
          <Link to="/social" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded"><MessageCircle/> Chat</Link>
          <Link to="/radio" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded"><Radio/> Radio</Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto">{children}</div>
        <nav className="md:hidden flex justify-around p-4 bg-gray-900 border-t border-white/10">
          <Link to="/home"><Home/></Link>
          <Link to="/social"><MessageCircle/></Link>
          <Link to="/radio"><Radio/></Link>
        </nav>
      </main>
    </div>
  );
}