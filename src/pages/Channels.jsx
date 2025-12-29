import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SideNav from "../components/layout/SideNav";
import ChannelCard from "../components/channel/ChannelCard";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { fetchData } from "../config/dataSource";

export default function Channels() {
  const navigate = useNavigate();

  const [channels, setChannels] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { channels } = await fetchData();
        setChannels(Array.isArray(channels) ? channels : []);
      } catch (e) {
        console.error(e);
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    channels.forEach((c) => {
      if (c?.category) set.add(c.category);
    });
    return ["all", ...Array.from(set)];
  }, [channels]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return channels.filter((c) => {
      const okCategory = category === "all"
        ? true
        : (c?.category || "") === category;

      const okQuery = !q
        ? true
        : (c?.name || "").toLowerCase().includes(q);

      return okCategory && okQuery;
    });
  }, [channels, query, category]);

  // 🔥 CLAVE: navegar directo a /player (evita 404)
  function handleChannelClick(channel) {
    navigate(`/player?channel=${encodeURIComponent(channel.id)}`);
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <SideNav currentPage="Channels" />

      <div className="ml-64 p-8">
        <h1 className="text-4xl font-bold mb-2">Canales TV</h1>
        <p className="text-white/60 mb-6">
          {loading ? "Cargando..." : `${filtered.length} canales disponibles`}
        </p>

        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar canales..."
            />
          </div>

          <div className="w-64">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
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

        {error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onClick={() => handleChannelClick(channel)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
