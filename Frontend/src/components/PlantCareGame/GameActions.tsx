
import React from 'react';
import { Trophy, Link } from 'lucide-react';

interface GameActionsProps {
  onWater: () => void;
  onFertilize: () => void;
  onPrune: () => void;
  onTreat: () => void;
  onChangePlant: () => void;
  onConnectWallet?: () => void;
  onViewAchievements?: () => void;
  fertilized: boolean;
  pruned: boolean;
  hasPest: boolean;
  growth: number;
  walletConnected?: boolean;
}

export const GameActions: React.FC<GameActionsProps> = ({
  onWater,
  onFertilize,
  onPrune,
  onTreat,
  onChangePlant,
  onConnectWallet,
  onViewAchievements,
  fertilized,
  pruned,
  hasPest,
  growth,
  walletConnected = false,
}) => {
  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onWater}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm shadow-lg flex items-center justify-center"
        >
          <span className="mr-1">💧</span> Water Plant
        </button>
        
        <button
          onClick={onFertilize}
          disabled={fertilized}
          className={`${
            fertilized ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } text-white py-2 px-4 rounded-lg text-sm shadow-lg flex items-center justify-center`}
        >
          <span className="mr-1">🌱</span> Fertilize
        </button>
        
        <button
          onClick={onPrune}
          disabled={pruned || growth < 30}
          className={`${
            pruned || growth < 30 ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
          } text-white py-2 px-4 rounded-lg text-sm shadow-lg flex items-center justify-center`}
        >
          <span className="mr-1">✂️</span> Prune
        </button>
        
        <button
          onClick={onTreat}
          disabled={!hasPest}
          className={`${
            !hasPest ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          } text-white py-2 px-4 rounded-lg text-sm shadow-lg flex items-center justify-center`}
        >
          <span className="mr-1">🐞</span> Treat Pests
        </button>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={onChangePlant}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm shadow-lg"
        >
          Change Plant Type
        </button>
        
        {!walletConnected ? (
          <button
            onClick={onConnectWallet}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-sm shadow-lg flex items-center justify-center"
          >
            <Link className="h-4 w-4 mr-1" /> Connect Wallet
          </button>
        ) : (
          <button
            onClick={onViewAchievements}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm shadow-lg flex items-center justify-center"
          >
            <Trophy className="h-4 w-4 mr-1" /> View Achievements
          </button>
        )}
      </div>
    </div>
  );
};
