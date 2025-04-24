import React from 'react';
import { Trophy, Star, Badge } from 'lucide-react';

interface GameStatsProps {
  days: number;
  growth: number;
  streak: number;
  stellarTokens?: number;
  achievements?: number;
}

const GameStats: React.FC<GameStatsProps> = ({ 
  days, 
  growth, 
  streak,
  stellarTokens = 0,
 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 text-center">
      <div className="bg-blue-900 p-2 rounded-lg">
        <Trophy className="h-4 w-4 inline mr-1 text-yellow-400" />
        <p className="text-xs font-semibold text-blue-100">Days</p>
        <h3 className="text-xl font-bold text-white">{days}</h3>
      </div>
      
      <div className="bg-blue-900 p-2 rounded-lg">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${growth}%` }}
          ></div>
        </div>
        <p className="text-xs font-semibold text-blue-100">Growth</p>
        <h3 className="text-xl font-bold text-white">{growth}%</h3>
      </div>
      
      <div className="bg-blue-900 p-2 rounded-lg">
        <Star className="h-4 w-4 inline mr-1 text-yellow-400" />
        <p className="text-xs font-semibold text-blue-100">Streak</p>
        <h3 className="text-xl font-bold text-white">{streak}</h3>
      </div>
      
      <div className="bg-blue-900 p-2 rounded-lg">
        <Badge className="h-4 w-4 inline mr-1 text-yellow-400" />
        <p className="text-xs font-semibold text-blue-100">Tokens</p>
        <h3 className="text-xl font-bold text-white">{stellarTokens}</h3>
      </div>
    </div>
  );
};

export default GameStats;
