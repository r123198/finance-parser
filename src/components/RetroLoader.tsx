import React from 'react';

export default function RetroLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="retro-loader mb-2" aria-label="Loading" />
      <span className="font-vt323 text-lg text-cyan-300 mt-2 animate-pulse">{label}</span>
    </div>
  );
} 