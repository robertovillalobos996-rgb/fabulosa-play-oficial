import { useQuery } from "@tanstack/react-query";
import ChannelCard from "../components/channel/ChannelCard";
import { fetchData } from "../config/dataSource";

export default function Channels() {
  const {
    data: channels = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { channels } = await fetchData();
      return (channels || [])
        .filter((c) => c.is_active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    retry: 3,                 // 🔑 reintenta si antes falló
    retryDelay: 1000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Cargando canales...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Error cargando datos
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Canales TV ({channels.length})
      </h1>

      {channels.length === 0 && (
        <div className="text-gray-400">
          No hay canales disponibles
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {channels.map((channel) => (
          <ChannelCard key={channel.id || channel.name} channel={channel} />
        ))}
      </div>
    </div>
  );
}
