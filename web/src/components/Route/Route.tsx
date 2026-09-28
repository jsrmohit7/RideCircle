import React from 'react';

interface RouteProps {
  origin: string;
  destination: string;
  vertical?: boolean;
  className?: string;
}

export const Route: React.FC<RouteProps> = ({ origin, destination, vertical = true, className = '' }) => {
  if (!vertical) {
    return (
      <div className={`flex items-center space-x-3 text-sm font-medium ${className}`}>
        <span>{origin}</span>
        <div className="flex-1 flex items-center">
          <div className="w-2 h-2 rounded-full bg-[var(--color-rc-purple-400)]" />
          <div className="flex-1 h-px bg-[var(--color-rc-purple-200)] mx-1" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-rc-purple-400)]" />
        </div>
        <span>{destination}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col relative pl-6 ${className}`}>
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border-light" />
      <div className="relative mb-6">
        <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-rc-purple-400 z-10" />
        <span className="font-sans font-bold text-black tracking-tight text-[15px]">{origin}</span>
      </div>
      <div className="relative">
        <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-rc-purple-400 z-10" />
        <span className="font-sans font-bold text-black tracking-tight text-[15px]">{destination}</span>
      </div>
    </div>
  );
};
