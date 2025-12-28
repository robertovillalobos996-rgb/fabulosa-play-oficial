import React from "react";

export default function PSCInforma() {
  const headerH = 76;
  return (
    <div style={{ width: "100%", height: "100vh", background: "#000", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px", background: "#111", borderBottom: "2px solid #e91e63" }}>
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69461c3d47b7013a4cbd935e/364a2e771_logopscinforma.jpg"
          alt="PSC Informa"
          style={{ height: "48px", marginRight: "12px" }}
        />
        <div>
          <h2 style={{ color: "#fff", margin: 0, fontSize: "20px" }}>PSC Informa</h2>
          <span style={{ color: "#e91e63", fontSize: "13px" }}>🔴 Noticias en vivo</span>
        </div>
      </div>

      <iframe
        title="PSC Informa Facebook"
        src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/profile.php?id=100089994882915&tabs=timeline&width=500&height=1600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false"
        style={{ width: "100%", height: `calc(100vh - ${headerH}px)`, border: "none", overflow: "auto", background: "#000" }}
        scrolling="yes"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
}
