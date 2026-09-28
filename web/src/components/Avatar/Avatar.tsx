import React from 'react';

export const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, size = 'md' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div className={`rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 ${sizes[size]}`}>
      {initials}
    </div>
  );
};
