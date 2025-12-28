import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import VideoPlayer from "../components/player/VideoPlayer";
import { fetchData } from "../config/dataSource";
import { createPageUrl } from "../utils/createPageUrl";

export default function Player() {
  const navigate = useNavigate();
  const [channelId, setChannelId] = useState(null);

  const { data: channels = [] } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { channels } = await fetchData();
      return (channels || [])
        .filter((c) => c.is_active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("channel");
    if (id) setChannelId(id);
  }, []);

  const currentChannel = channels.find((c) => String(c.id) === String(channelId));
  const currentIndex = channels.findIndex((c) => String(c.id) === String(channelId));

  const handleClose = () => navigate(createPageUrl("Channels"));

  const handleNextChannel = () => {
    if (currentIndex < channels.length - 1) {
      const nextChannel = channels[currentIndex + 1];
      setChannelId(nextChannel.id);
      localStorage.setItem("lastChannel", JSON.stringify(nextChannel));
      window.history.replaceState(null, "", createPageUrl("Player") + "?channel=" + nextChannel.id);
    }
  };

  const handlePrevChannel = () => {
    if (currentIndex > 0) {
      const prevChannel = channels[currentIndex - 1];
      setChannelId(prevChannel.id);
      localStorage.setItem("lastChannel", JSON.stringify(prevChannel));
      window.history.replaceState(null, "", createPageUrl("Player") + "?channel=" + prevChannel.id);
    }
  };

  if (!currentChannel) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <VideoPlayer
      channel={currentChannel}
      onClose={handleClose}
      onNextChannel={currentIndex < channels.length - 1 ? handleNextChannel : null}
      onPrevChannel={currentIndex > 0 ? handlePrevChannel : null}
    />
  );
}
