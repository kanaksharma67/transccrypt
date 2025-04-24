
import React from "react";
import { Volume } from "lucide-react";

interface VolumeIndicatorProps {
  value: number | undefined;
  className?: string;
}

export function VolumeIndicator({ value, className }: VolumeIndicatorProps) {
  const formatVolume = (vol: number | undefined): string => {
    if (vol === undefined || isNaN(vol)) return "N/A";
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
    return vol.toFixed(2);
  };

  return (
    <div className={`flex items-center text-slate-400 ${className}`}>
      <Volume className="h-3 w-3 mr-1" />
      <span className="text-xs">Vol: {formatVolume(value)}</span>
    </div>
  );
}
