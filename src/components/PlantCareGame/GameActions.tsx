interface GameActionsProps {
    onWater: () => void;
    onFertilize: () => void;
    onPrune: () => void;
    onTreat: () => void;
    onChangePlant: () => void;
    fertilized: boolean;
    pruned: boolean;
    hasPest: boolean;
    growth: number;
  }
  
  export const GameActions = ({
    onWater,
    onFertilize,
    onPrune,
    onTreat,
    onChangePlant,
    fertilized,
    pruned,
    hasPest,
    growth,
  }: GameActionsProps) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        <button
          onClick={onWater}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-semibold transition-all hover:bg-blue-700 hover:translate-y-[-2px] hover:shadow-md"
        >
          <span>💧</span> Water Plant
        </button>
        <button
          onClick={onFertilize}
          disabled={fertilized || growth < 20}
          className={`flex items-center gap-2 px-5 py-3 rounded-full bg-teal-500 text-white font-semibold transition-all hover:bg-teal-600 hover:translate-y-[-2px] hover:shadow-md ${
            !fertilized && growth >= 20 ? 'relative after:absolute after:top-[-5px] after:right-[-5px] after:w-4 after:h-4 after:bg-teal-500 after:rounded-full after:border-2 after:border-white after:animate-pulse' : ''
          }`}
        >
          <span>🌱</span> Fertilize
        </button>
        <button
          onClick={onPrune}
          disabled={pruned || growth < 30}
          className={`flex items-center gap-2 px-5 py-3 rounded-full bg-yellow-400 text-gray-800 font-semibold transition-all hover:bg-yellow-500 hover:translate-y-[-2px] hover:shadow-md ${
            !pruned && growth >= 30 ? 'relative after:absolute after:top-[-5px] after:right-[-5px] after:w-4 after:h-4 after:bg-yellow-400 after:rounded-full after:border-2 after:border-white after:animate-pulse' : ''
          }`}
        >
          <span>✂️</span> Prune
        </button>
        <button
          onClick={onTreat}
          disabled={!hasPest}
          className={`flex items-center gap-2 px-5 py-3 rounded-full bg-red-500 text-white font-semibold transition-all hover:bg-red-600 hover:translate-y-[-2px] hover:shadow-md ${
            hasPest ? 'relative after:absolute after:top-[-5px] after:right-[-5px] after:w-4 after:h-4 after:bg-red-500 after:rounded-full after:border-2 after:border-white after:animate-pulse' : ''
          }`}
        >
          <span>🐛</span> Treat
        </button>
        <button
          onClick={onChangePlant}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-green-500 text-white font-semibold transition-all hover:bg-green-600 hover:translate-y-[-2px] hover:shadow-md"
        >
          <span>🔄</span> Change Plant
        </button>
      </div>
    );
  };