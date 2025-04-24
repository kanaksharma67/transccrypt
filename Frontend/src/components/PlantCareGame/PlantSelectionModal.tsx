import React from 'react';
import { PlantType } from '../types/PlantTypes';

interface PlantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plantType: PlantType) => void;
  currentPlantType: PlantType | null;
  plantTypes: PlantType[];
}

export const PlantSelectionModal: React.FC<PlantSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentPlantType,
  plantTypes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">Select Your Plant</h2>
        
        <div className="space-y-4">
          {plantTypes.map((plant) => (
            <div
              key={plant.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                currentPlantType?.id === plant.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => {
                onSelect(plant);
                onClose();
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{plant.name}</h3>
                <span className="text-sm px-2 py-1 rounded bg-opacity-70 bg-gray-800">
                  {plant.difficulty}
                </span>
              </div>
              
              <p className="text-sm mt-2 text-gray-200">{plant.description}</p>
              
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-800 p-1 rounded">
                  <span className="block text-center text-gray-400">Water</span>
                  <span className="block text-center font-bold">
                    {plant.waterFrequency === 1 ? 'Daily' : `Every ${plant.waterFrequency} days`}
                  </span>
                </div>
                
                <div className="bg-gray-800 p-1 rounded">
                  <span className="block text-center text-gray-400">Growth Boost</span>
                  <span className="block text-center font-bold">+{plant.fertilizerBoost}</span>
                </div>
                
                <div className="bg-gray-800 p-1 rounded">
                  <span className="block text-center text-gray-400">Pest Risk</span>
                  <span className="block text-center font-bold">
                    {Math.round(plant.pestChance * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
