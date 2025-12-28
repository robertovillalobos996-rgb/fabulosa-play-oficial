import React from "react";
import { Link } from "react-router-dom";
import { Home, Tv, Radio, Wifi } from "lucide-react";
import { motion } from "framer-motion";

import { createPageUrl } from "../../utils/createPageUrl";

const navItems = [
  { name: "Inicio", page: "Home", icon: Home },
  { name: "Canales TV", page: "Channels", icon: Tv },
  { name: "Radio Fabulosa", page: "Radio", icon: Radio },
  { name: "En Vivo", page: "Live", icon: Wifi },
];

export default function SideNav({ currentPage }) {
  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0f] border-r border-white/5 flex flex-col p-6 z-50"
    >
      <Link to={createPageUrl("Home")} className="mb-12 group">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69461c3d47b7013a4cbd935e/0fb6f470e_logo.png"
            alt="Fabulosa Play"
            className="w-full h-auto object-contain"
          />
          <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-300 mt-2" />
        </motion.div>
      </Link>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;

          return (
            <Link key={item.page} to={createPageUrl(item.page)}>
              <motion.div
                whileHover={{ x: 8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-lg font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/5">
        <p className="text-xs text-gray-600 text-center">Fabulosa Play v1.0</p>
      </div>
    </motion.nav>
  );
}
