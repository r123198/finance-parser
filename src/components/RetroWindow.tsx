import React from 'react';

interface RetroWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function RetroWindow({ title, children, className = '' }: RetroWindowProps) {
  return (
    <div className={`bg-white border-4 border-cyan-400 rounded-lg shadow-lg font-vt323 retro-window ${className}`} style={{ overflow: 'hidden' }}>
      {title && (
        <div className="flex items-center bg-cyan-400 px-4 py-2 border-b-4 border-b-pink-400">
          <span className="text-lg font-bold text-black flex-1">{title}</span>
          <span className="ml-2 text-black text-lg">■</span>
          <span className="ml-1 text-black text-lg">▢</span>
          <span className="ml-1 text-black text-lg">✕</span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
} 