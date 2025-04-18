import { useEffect, useState } from 'react';
// import { useRef } from 'react';
import { PlantType } from '@/components/types/PlantTypes';

interface PlantVisualizationProps {
  plantType: PlantType | null;
  growth: number;
  hasPest: boolean;
  decorations: string[];
  streak: number;
}

const PlantVisualization = ({
  plantType,
  growth,
  hasPest,
  decorations,
  streak,
}: PlantVisualizationProps) => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const isNight = currentHour < 6 || currentHour >= 18;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      if (hour !== currentHour) {
        setCurrentHour(hour);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentHour]);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push(
        <div
          key={i}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: isNight ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
        />
      );
    }
    return stars;
  };

  const renderPlantStage = () => {
    if (!plantType) return null;

    let stageIndex;
    if (growth >= 90) stageIndex = 4;
    else if (growth >= 70) stageIndex = 3;
    else if (growth >= 40) stageIndex = 2;
    else if (growth >= 15) stageIndex = 1;
    else stageIndex = 0;

    const stageClass = plantType.stages[stageIndex];
    
    // Render special features if they exist
    const specialFeature = plantType.specialFeature?.(growth);

    return (
      <div className={`plant ${stageClass}`}>
        {specialFeature}
      </div>
    );
  };

  const renderDecorations = () => {
    const elements = [];
    
    if (decorations.includes('ribbon') || decorations.includes('both')) {
      elements.push(
        <div
          key="ribbon"
          className="absolute top-[-10px] right-[-10px] w-10 h-10 bg-yellow-400 clip-path-polygon-ribbon flex justify-center items-start pt-1 text-xs font-bold text-gray-800 z-50"
        >
          {streak}
        </div>
      );
    }
    
    if (decorations.includes('hat') || decorations.includes('both')) {
      elements.push(
        <div
          key="hat"
          className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-8 h-5 bg-red-500 rounded-t-full z-50"
        >
          <div className="absolute bottom-[-5px] left-0 w-full h-[5px] bg-red-500"></div>
        </div>
      );
    }
    
    return elements;
  };

  return (
    <div className="relative h-64 flex justify-center items-end mb-5">
      {/* Sun/Moon */}
      <div
        className={`absolute top-5 right-8 w-12 h-12 rounded-full ${
          isNight ? 'bg-gray-200' : 'bg-yellow-400'
        } shadow-lg transition-opacity duration-1000 ${
          isNight ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {!isNight && (
          <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,rgba(255,235,59,0.7)_0deg_15deg,transparent_15deg_30deg)] rounded-full animate-rotate-sun"></div>
        )}
      </div>
      
      <div
        className={`absolute top-5 right-8 w-12 h-12 rounded-full bg-gray-200 shadow-lg transition-opacity duration-1000 ${
          isNight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-2 left-4 w-2 h-2 bg-black bg-opacity-10 rounded-full"></div>
        <div className="absolute top-5 right-2 w-1.5 h-1.5 bg-black bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-4 left-2 w-2.5 h-2.5 bg-black bg-opacity-10 rounded-full"></div>
      </div>
      
      {/* Stars */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isNight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {renderStars()}
      </div>
      
      {/* Plant Pot */}
      <div className="relative w-32 h-24 bg-brown-700 rounded-b-2xl shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,transparent_10%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2)_0%,transparent_10%)] rounded-b-2xl"></div>
      </div>
      
      {/* Plant */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 transition-all duration-800 origin-bottom">
        {renderPlantStage()}
      </div>
      
      {/* Decorations */}
      {renderDecorations()}
    </div>
  );
};

export default PlantVisualization;