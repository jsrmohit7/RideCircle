import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Plus, CarFront, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="bg-white/80 backdrop-blur-md border border-zinc-200 rounded-full px-6 py-3 flex items-center space-x-8 shadow-sm">
        
        <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}>
          <Home size={22} strokeWidth={2.5} />
        </NavLink>
        
        <NavLink to="/search" className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}>
          <Search size={22} strokeWidth={2.5} />
        </NavLink>

        <NavLink to="/offer">
          <motion.div whileTap={{ scale: 0.95 }} className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-md">
            <Plus size={24} strokeWidth={3} />
          </motion.div>
        </NavLink>

        <NavLink to="/rides" className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}>
          <CarFront size={22} strokeWidth={2.5} />
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}>
          <User size={22} strokeWidth={2.5} />
        </NavLink>

      </div>
    </div>
  );
};
