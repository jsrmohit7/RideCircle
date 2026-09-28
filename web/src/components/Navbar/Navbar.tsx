import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Plus, Map, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-[6px] sm:gap-[10px] p-[8px] bg-white/90 backdrop-blur-[20px] border border-zinc-200 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      
      <NavLink 
        to="/home" 
        className={({ isActive }) => `flex items-center justify-center w-12 h-12 md:w-auto md:px-5 md:h-[42px] rounded-full transition-all duration-300 ${isActive ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-black hover:bg-zinc-50'}`}
        title="Home"
      >
        <Home size={20} className="md:mr-2" />
        <span className="hidden md:inline text-[15px] font-bold">Home</span>
      </NavLink>

      <NavLink 
        to="/rides" 
        className={({ isActive }) => `flex items-center justify-center w-12 h-12 md:w-auto md:px-5 md:h-[42px] rounded-full transition-all duration-300 ${isActive ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-black hover:bg-zinc-50'}`}
        title="Discover rides"
      >
        <Search size={20} className="md:mr-2" />
        <span className="hidden md:inline text-[15px] font-bold">Rides</span>
      </NavLink>

      <NavLink 
        to="/offer" 
        className={({ isActive }) => `flex items-center justify-center w-12 h-12 md:w-auto md:px-5 md:h-[42px] rounded-full transition-all duration-300 ${isActive ? 'bg-black text-white shadow-md scale-105' : 'bg-black text-white hover:bg-zinc-800 hover:scale-105 mx-1 md:mx-2'}`}
        title="Offer a ride"
      >
        <Plus size={20} className="md:mr-2" strokeWidth={2.5} />
        <span className="hidden md:inline text-[15px] font-bold">Offer</span>
      </NavLink>

      <NavLink 
        to="/my-rides" 
        className={({ isActive }) => `flex items-center justify-center w-12 h-12 md:w-auto md:px-5 md:h-[42px] rounded-full transition-all duration-300 ${isActive ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-black hover:bg-zinc-50'}`}
        title="My rides"
      >
        <Map size={20} className="md:mr-2" />
        <span className="hidden md:inline text-[15px] font-bold">My Rides</span>
      </NavLink>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => `flex items-center justify-center w-12 h-12 md:w-auto md:px-5 md:h-[42px] rounded-full transition-all duration-300 ${isActive ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-black hover:bg-zinc-50'}`}
        title="Profile"
      >
        <User size={20} className="md:mr-2" />
        <span className="hidden md:inline text-[15px] font-bold">Profile</span>
      </NavLink>

    </nav>
  );
};
