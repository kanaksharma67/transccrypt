import { PlantType } from "../types/PlantTypes";
import { useState } from 'react';

interface PlantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plantType: PlantType) => void;
  currentPlantType: PlantType | null;
  plantTypes: PlantType[];
}

export const PlantSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  currentPlantType,
  plantTypes,
}: PlantSelectionModalProps) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(
    currentPlantType?.id || null
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-md w-[90%] max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold">Choose Your Plant</h2>
          <p>Select a plant type to care for</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plantTypes.map((plant) => (
            <div
              key={plant.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedPlantId === plant.id
                  ? 'border-2 border-teal-500 bg-teal-50 dark:bg-teal-900 bg-opacity-10'
                  : 'border-2 border-transparent bg-gray-100 dark:bg-gray-700'
              }`}
              onClick={() => setSelectedPlantId(plant.id)}
            >
              <div className="h-24 flex justify-center items-end mb-2">
                <div className={`plant ${plant.stages[2]}`}></div>
              </div>
              <div className="font-semibold">{plant.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Difficulty: {plant.difficulty}
              </div>
              <p className="text-sm mt-1">{plant.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-5 gap-2">
          <button
            onClick={() => {
              const selected = plantTypes.find(p => p.id === selectedPlantId);
              if (selected) {
                onSelect(selected);
              }
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold"
          >
            Select Plant
          </button>
        </div>
      </div>
    </div>
  );
};