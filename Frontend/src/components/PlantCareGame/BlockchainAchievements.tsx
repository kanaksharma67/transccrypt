import React from 'react';
import { Achievement } from '../types/PlantTypes';
import { Check, Shield, Star } from 'lucide-react';

interface BlockchainAchievementsProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  stellarTokens: number;
  walletAddress: string | null;
}

const BlockchainAchievements: React.FC<BlockchainAchievementsProps> = ({
  isOpen,
  onClose,
  achievements,
  stellarTokens,
  walletAddress,
}) => {
  if (!isOpen) return null;

  //const completedAchievements = achievements.filter(a => a.completed);
  const verifiedAchievements = achievements.filter(a => a.verified);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Blockchain Achievements</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-blue-900 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-200">Connected Wallet</p>
          <p className="text-xs font-mono text-white break-all">
            {walletAddress || 'Not connected'}
          </p>
          
          <div className="mt-2">
            <div className="flex justify-between text-white">
              <span>Stellar Tokens</span>
              <span className="font-bold">{stellarTokens}</span>
            </div>
            <div className="flex justify-between text-white mt-1">
              <span>Verified on Monad</span>
              <span className="font-bold">{verifiedAchievements.length} / {achievements.length}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Your Achievements</h3>
          
          {achievements.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No achievements yet. Keep growing your plant!
            </p>
          ) : (
            achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-3 rounded-lg border ${
                  achievement.completed 
                    ? achievement.verified 
                      ? 'border-green-600 bg-green-900 bg-opacity-30' 
                      : 'border-yellow-600 bg-yellow-900 bg-opacity-30' 
                    : 'border-gray-700 bg-gray-900 bg-opacity-30'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${
                    achievement.completed 
                      ? achievement.verified 
                        ? 'bg-green-700' 
                        : 'bg-yellow-700' 
                      : 'bg-gray-700'
                  }`}>
                    {achievement.verified ? (
                      <Shield className="h-4 w-4 text-white" />
                    ) : achievement.completed ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <Star className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{achievement.title}</h4>
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                    
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-blue-300">
                        {achievement.completed ? 'Completed' : 'In Progress'}
                      </span>
                      <span className="text-yellow-300">
                        {achievement.tokenReward} Stellar Tokens
                      </span>
                    </div>
                    
                    {achievement.completed && !achievement.verified && (
                      <div className="mt-2 text-right">
                        <div className="inline-block text-xs px-2 py-1 bg-blue-800 rounded text-blue-200">
                          Verification Pending on Screenpipe
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockchainAchievements;
