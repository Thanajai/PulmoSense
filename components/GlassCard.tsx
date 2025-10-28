
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
