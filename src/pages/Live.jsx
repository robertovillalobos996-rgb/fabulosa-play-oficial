import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Wifi, Tv, Radio as RadioIcon } from "lucide-react";

import ChannelCard from "../components/channel/ChannelCard";
import { fetchData } from "../config/dataSource";
import { createPageUrl } from "../utils/createPageUrl";

export default function Live() {
  const { data: channels = [], isLoading: channelsLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { channels } = await fetchData();
      return (channels || [])
        .filter((c) => c.is_active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });

  const { data: radioStations = [], isLoading: radioLoading } = useQuery({
    queryKey: ["radioStations"],
    queryFn: async () => {
      const { stations } = await fetchData();
      return (stations || []).filter((r) => r.is_active !== false);
    },
  });

  const isLoading = channelsLoading || radioLoading;

  const handleChannelClick = (channel) => {
    localStorage.setItem("lastChannel", JSON.stringify(channel));
    window.location.href = createPageUrl("Player") + "?channel=" + channel.id;
  };

  const handleRadioClick = () => {
    window.location.href = createPageUrl("Radio");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">En Vivo</h1>
              <p className="text-xl text-gray-400 mt-2">Todo el contenido en vivo disponible ahora</p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {radioStations.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <RadioIcon className="w-6 h-6 text-fuchsia-500" />
                  <h2 className="text-3xl font-bold text-white">Radio</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {radioStations.map((station) => (
                    <div key={station.id || station.name} onClick={handleRadioClick}>
                      <ChannelCard channel={{ ...station, category: "Radio" }} onClick={handleRadioClick} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {channels.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Tv className="w-6 h-6 text-fuchsia-500" />
                  <h2 className="text-3xl font-bold text-white">Canales TV</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {channels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} onClick={() => handleChannelClick(channel)} />
                  ))}
                </div>
              </motion.div>
            )}

            {channels.length === 0 && radioStations.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Wifi className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <p className="text-2xl text-gray-500">No hay contenido en vivo disponible</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
