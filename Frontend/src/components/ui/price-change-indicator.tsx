
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface PriceChangeIndicatorProps {
  value: number | undefined;
  className?: string;
}

export function PriceChangeIndicator({ value, className }: PriceChangeIndicatorProps) {
  if (value === undefined || isNaN(value)) {
    return (
      <div className={`flex items-center text-slate-400 ${className}`}>
        <span className="text-xs font-medium">N/A</span>
      </div>
    );
  }
  
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUp : ArrowDown;
  const color = isPositive ? "text-emerald-400" : "text-red-400";
  
  return (
    <div className={`flex items-center ${color} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      <span className="text-xs font-medium">{Math.abs(value).toFixed(2)}%</span>
    </div>
  );
}
