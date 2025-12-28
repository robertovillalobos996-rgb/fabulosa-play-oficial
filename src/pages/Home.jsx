import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tv, Radio, Wifi, Play, TrendingUp } from "lucide-react";

import { Button } from "../components/ui/button";
import ChannelCard from "../components/channel/ChannelCard";
import { fetchData } from "../config/dataSource";
import { createPageUrl } from "../utils/createPageUrl";

export default function Home() {
  const [lastChannel, setLastChannel] = useState(null);

  const { data: channels = [] } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { channels } = await fetchData();
      return (channels || [])
        .filter((c) => c.is_active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .slice(0, 6);
    },
  });

  const { data: radioStations = [] } = useQuery({
    queryKey: ["radioStations"],
    queryFn: async () => {
      const { stations } = await fetchData();
      return (stations || []).filter((r) => r.is_active !== false).slice(0, 1);
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("lastChannel");
    if (stored) setLastChannel(JSON.parse(stored));
  }, []);

  const handleChannelClick = (channel) => {
    localStorage.setItem("lastChannel", JSON.stringify(channel));
    window.location.href = createPageUrl("Player") + "?channel=" + channel.id;
  };

  const quickActions = [
    { title: "Canales TV", description: "Ver todos los canales", icon: Tv, page: "Channels", color: "from-fuchsia-600 to-pink-600" },
    { title: "Fabulosa La Radio Romantica", description: "Escuchar en vivo", icon: Radio, page: "Radio", color: "from-purple-600 to-pink-600",
      logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69461c3d47b7013a4cbd935e/172344514_logo-fabulosa.png" },
    { title: "PSC Informa", description: "Noticias en vivo", icon: Wifi, page: "PSCInforma", color: "from-red-600 to-pink-600",
      logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69461c3d47b7013a4cbd935e/364a2e771_logopscinforma.jpg" },
    { title: "En Vivo", description: "Todo el contenido", icon: Wifi, page: "Live", color: "from-pink-600 to-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden p-12 min-h-[400px] flex items-center"
          style={{
            backgroundImage:
              "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69461c3d47b7013a4cbd935e/ed6f24e32_imagen.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
              Bienvenido a Fabulosa Play
            </h1>
            <p className="text-2xl text-white mb-8 drop-shadow-lg">
              Tu plataforma de streaming en vivo
            </p>
            <Link to={createPageUrl("Channels")}>
              <Button className="bg-white text-fuchsia-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl font-bold shadow-xl">
                <Play className="w-6 h-6 mr-2" />
                Comenzar a Ver
              </Button>
            </Link>
          </div>
        </motion.div>

        {lastChannel && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-fuchsia-500" />
              <h2 className="text-3xl font-bold text-white">Continuar Viendo</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ChannelCard channel={lastChannel} onClick={() => handleChannelClick(lastChannel)} />
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold text-white mb-6">Acceso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isRadio = action.page === "Radio";
              return (
                <Link key={index} to={createPageUrl(action.page)}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative rounded-2xl bg-gradient-to-br ${action.color} p-6 overflow-hidden group cursor-pointer h-64 flex flex-col justify-center`}
                  >
                    {isRadio && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute text-pink-200/30"
                            initial={{
                              bottom: -20,
                              left: `${15 + i * 15}%`,
                              scale: 0.5 + Math.random() * 0.5,
                            }}
                            animate={{
                              bottom: ["0%", "110%"],
                              opacity: [0, 0.6, 0],
                              x: [0, Math.sin(i) * 30],
                            }}
                            transition={{
                              duration: 6 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.8,
                              ease: "easeOut",
                            }}
                            style={{ fontSize: "20px" }}
                          >
                            ♥
                          </motion.div>
                        ))}
                      </>
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center">
                      {action.logo ? (
                        <img src={action.logo} alt={action.title} className="w-16 h-16 object-contain mb-3" />
                      ) : (
                        <Icon className="w-10 h-10 text-white mb-3" />
                      )}
                      <h3 className="text-lg font-bold text-white mb-1 leading-tight">{action.title}</h3>
                      <p className="text-white/80 text-sm">{action.description}</p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {channels.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-bold text-white mb-6">Canales Destacados</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} onClick={() => handleChannelClick(channel)} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
