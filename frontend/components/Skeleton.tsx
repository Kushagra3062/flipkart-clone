import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ 
  className = '', 
  variant = 'rect', 
  width, 
  height 
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-gray-200 relative overflow-hidden";
  const variantClass = {
    text: "rounded h-4 w-full mb-2",
    rect: "rounded-sm",
    circle: "rounded-full"
  }[variant];

  const style: React.CSSProperties = {
    width: width,
    height: height
  };

  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
