import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function ChannelCard({ channel, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] rounded-2xl overflow-hidden border border-white/5 hover:border-fuchsia-500/50 transition-all duration-300">
        {channel.logo || channel.logo_url ? (
          <img
            src={channel.logo || channel.logo_url}
            alt={channel.name}
            className="w-full h-full object-contain p-2"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center">
              <span className="text-3xl font-black text-white">
                {channel?.name?.charAt(0) || "?"}
              </span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-fuchsia-600 flex items-center justify-center shadow-xl">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
            <span className="text-white font-semibold text-sm">
              {channel.category || "En Vivo"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h3 className="text-white font-semibold text-sm truncate px-1">
          {channel.name}
        </h3>
      </div>
    </motion.div>
  );
}
