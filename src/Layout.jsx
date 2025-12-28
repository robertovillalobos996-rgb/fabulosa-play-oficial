import React from "react";
import SideNav from "./components/navigation/SideNav";

export default function Layout({ children, currentPageName }) {
  const fullScreenPages = ["Splash", "Player"];
  const isFullScreen = fullScreenPages.includes(currentPageName);

  if (isFullScreen) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <style>{`
        :root {
          --color-bg-primary: #0a0a0f;
          --color-bg-secondary: #1a1a24;
          --color-accent-primary: #c026d3;
          --color-accent-secondary: #d946ef;
        }

        body {
          background: var(--color-bg-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: var(--color-accent-primary) var(--color-bg-secondary);
        }

        *::-webkit-scrollbar { width: 8px; height: 8px; }
        *::-webkit-scrollbar-track { background: var(--color-bg-secondary); }
        *::-webkit-scrollbar-thumb { background: var(--color-accent-primary); border-radius: 4px; }
        *::-webkit-scrollbar-thumb:hover { background: var(--color-accent-secondary); }
      `}</style>

      <SideNav currentPage={currentPageName} />
      <div className="pl-64">{children}</div>
    </div>
  );
}
