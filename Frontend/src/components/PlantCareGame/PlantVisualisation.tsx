import React from 'react';
import { PlantType } from '../types/PlantTypes';

interface PlantVisualizationProps {
  plantType: PlantType | null;
  growth: number;
  hasPest: boolean;
  decorations: string[];
  streak: number;
}

const PlantVisualization: React.FC<PlantVisualizationProps> = ({
  plantType,
  growth,
  hasPest,
  decorations,
  streak,
}) => {
  if (!plantType) {
    return (
      <div className="flex justify-center items-center h-40 my-8">
        <div className="text-gray-400 dark:text-gray-500">Select a plant to start growing</div>
      </div>
    );
  }

  // Height calculation based on growth
  const heightPercentage = (growth / 100) * 100;

  return (
    <div className="flex justify-center items-end my-8 relative">
      <div
        className={`relative h-${Math.max(8, Math.floor(heightPercentage / 10) * 4)} w-${
          Math.max(6, Math.floor(heightPercentage / 10) * 3)
        } transition-all duration-1000 overflow-visible`}
        style={{ minHeight: '80px', minWidth: '60px' }}
      >
        {/* Base plant visualization */}
        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-${Math.max(
            6,
            Math.floor(heightPercentage / 10) * 3
          )} ${
            plantType.id === 'default'
              ? 'bg-green-500'
              : plantType.id === 'flowering'
              ? 'bg-pink-200'
              : 'bg-yellow-700'
          } rounded-t-full transition-all duration-700`}
          style={{ 
            height: `${heightPercentage}%`,
            maxHeight: '160px',
            minHeight: '30px',
            minWidth: '30px' 
          }}
        ></div>

        {/* Special features based on plant type */}
        {plantType.specialFeature && plantType.specialFeature(growth)}

        {/* Pest visualization */}
        {hasPest &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`pest-${i}`}
              className="absolute w-2 h-2 bg-black rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            ></div>
          ))}

        {/* Decorations */}
        {decorations.includes('ribbon') && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-10 bg-blue-500 rounded-sm relative">
              <div className="absolute bottom-0 left-0 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-500"></div>
            </div>
          </div>
        )}

        {decorations.includes('hat') && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-4 bg-purple-700 rounded-t-full"></div>
            <div className="w-12 h-1 bg-purple-900 rounded-sm -mt-1"></div>
          </div>
        )}

        {/* Blockchain verification badge */}
        {streak >= 3 && (
          <div className="absolute -top-4 -left-4 bg-blue-600 text-white text-xs font-bold p-1 rounded-full w-6 h-6 flex items-center justify-center">
            ✓
          </div>
        )}
      </div>

      {/* Pot */}
      <div className="relative">
        <div className="w-24 h-6 bg-orange-900 rounded-t-md"></div>
        <div className="w-20 h-10 bg-orange-700 rounded-b-md mx-auto"></div>
      </div>
    </div>
  );
};

export default PlantVisualization;
