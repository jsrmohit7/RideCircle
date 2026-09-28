import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</label>}
      <input 
        className={`bg-white border ${error ? 'border-red-300 focus:ring-red-100' : 'border-zinc-200 focus:ring-[var(--color-rc-purple-100)] focus:border-[var(--color-rc-purple-300)]'} rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 transition-all ${className}`}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
};
