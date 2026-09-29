import React, { useState } from 'react';

export const Avatar: React.FC<{ name: string; src?: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, src, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-24 h-24 text-2xl', // Increased lg size to make profile pictures look better on Profile page
  };

  return (
    <div className={`rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 overflow-hidden ${sizes[size]}`}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={() => setImgError(true)} 
        />
      ) : (
        initials
      )}
    </div>
  );
};
