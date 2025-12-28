import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tv, Search, Filter } from "lucide-react";

import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import ChannelCard from "../components/channel/ChannelCard";
import { fetchData } from "../config/dataSource";
import { createPageUrl } from "../utils/createPageUrl";

export default function Channels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: channels = [], isLoading, error } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { channels } = await fetchData();
      return (channels || [])
        .filter((c) => c.is_active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || channel.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(channels.map((c) => c.category).filter(Boolean))];

  const handleChannelClick = (channel) => {
    localStorage.setItem("lastChannel", JSON.stringify(channel));
    window.location.href = createPageUrl("Player") + "?channel=" + channel.id;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center">
              <Tv className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">Canales TV</h1>
              <p className="text-xl text-gray-400 mt-2">{channels.length} canales disponibles</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Buscar canales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-[#1a1a24] border border-white/10 text-white text-lg rounded-xl"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-64 h-14">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "Todas las categorías" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg">Cargando...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500 text-lg">Error cargando datos</p>
          </div>
        ) : filteredChannels.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Tv className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-2xl text-gray-500">No se encontraron canales</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredChannels.map((channel, index) => (
              <motion.div key={channel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <ChannelCard channel={channel} onClick={() => handleChannelClick(channel)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
