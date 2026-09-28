import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Plus, Map, User, Home, CarFront } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled 
            ? 'bg-white/85 backdrop-blur-[12px] border-b border-[#E4E4E7]' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div 
            className="cursor-pointer flex items-center space-x-3"
            onClick={() => navigate('/')}
          >
            <img src="/logo.svg" alt="RideCircle Logo" className="w-8 h-8" />
            <span className="font-sans font-extrabold text-xl tracking-tight hidden sm:block">RideCircle</span>
          </div>

        </div>
      </header>
    </>
  );
};
