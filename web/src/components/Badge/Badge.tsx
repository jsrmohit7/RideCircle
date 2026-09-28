import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'accent', className?: string }> = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    accent: 'bg-[var(--color-rc-purple-100)] text-[var(--color-rc-purple-500)] border-[var(--color-rc-purple-200)]',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
