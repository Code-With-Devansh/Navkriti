// components/GlobalLoadingBar.jsx - Alternative style
'use client';

import { useLoading } from '@/contexts/LoadingContext';

export default function GlobalLoadingBar() {
  const { isLoading, progress } = useLoading();

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5">
      <div 
        className="h-full bg-blue-600 transition-all duration-200 ease-out"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(37, 99, 235, 0.8)',
        }}
      />
      {/* Glow effect */}
      {progress < 100 && (
        <div 
          className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-blue-400 to-transparent animate-pulse"
          style={{ right: `${100 - progress}%` }}
        />
      )}
    </div>
  );
}
