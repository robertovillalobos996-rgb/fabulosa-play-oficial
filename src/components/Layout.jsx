import React from 'react';

/**
 * Layout Principal - Fabulosa Play Hub 2026
 * Se ha eliminado el chat pequeño y cualquier sidebar desde la raíz.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#06060a] relative overflow-x-hidden">
      {/* Este contenedor envuelve toda la aplicación.
        Se eliminaron los componentes: 'ChatSidebar', 'FloatingChat' y 'SmallChat'.
        Ahora el espacio es 100% para el contenido que definas en Home.jsx.
      */}
      
      <main className="relative z-10 w-full">
        {children}
      </main>

      {/* Footer Global opcional (si prefieres tenerlo aquí en lugar de Home.jsx)
        Por ahora se deja limpio para que el control total esté en tu página principal.
      */}
    </div>
  );
};

export default Layout;