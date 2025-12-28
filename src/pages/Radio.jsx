import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Radio as RadioIcon } from "lucide-react";

import AudioPlayer from "../components/player/AudioPlayer";
import { fetchData } from "../config/dataSource";

export default function Radio() {
  const { data: radioStations = [], isLoading, error } = useQuery({
    queryKey: ["radioStations"],
    queryFn: async () => {
      const { stations } = await fetchData();
      return (stations || []).filter((r) => r.is_active !== false);
    },
  });

  const fabulosaRadio =
    radioStations.find((station) => station.name?.toLowerCase().includes("fabulosa")) || radioStations[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69461c3d47b7013a4cbd935e/172344514_logo-fabulosa.png"
              alt="Radio Fabulosa"
              className="w-32 h-32 object-contain"
            />
            <div>
              <h1 className="text-5xl font-black text-white">Fabulosa La Radio Romantica</h1>
              <p className="text-xl text-gray-400 mt-2">Transmisión en vivo 24/7</p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg">Cargando...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-red-500 text-lg">Error cargando datos</p>
          </div>
        ) : fabulosaRadio ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-300/40 pointer-events-none"
                style={{ left: `${10 + (i % 4) * 25}%`, top: `${20 + Math.floor(i / 4) * 50}%`, fontSize: "24px" }}
                animate={{ y: [-10, -30, -10], opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.1, 0.8], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              >
                ♥
              </motion.div>
            ))}
            <AudioPlayer station={fabulosaRadio} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-[#1a1a24] rounded-3xl border border-white/10">
            <RadioIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-2xl text-gray-500">No hay estaciones de radio disponibles</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12 bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] rounded-3xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Acerca de Radio Fabulosa</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            {fabulosaRadio?.description ||
              "Radio Fabulosa transmite las mejores canciones y programas en vivo, 24 horas al día, 7 días a la semana. Disfrutá de la mejor música y entretenimiento."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
