interface GameStatsProps {
    days: number;
    growth: number;
    streak: number;
  }
  
  const GameStats = ({ days, growth, streak }: GameStatsProps) => {
    return (
      <div className="flex justify-around mb-5 bg-teal-100 bg-opacity-10 p-4 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-semibold text-blue-700">{days}</div>
          <div className="text-xs text-blue-600">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-blue-700">{growth}%</div>
          <div className="text-xs text-blue-600">Growth</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-blue-700">{streak}</div>
          <div className="text-xs text-blue-600">Streak</div>
        </div>
      </div>
    );
  };

//   export default GameStats;
  export default GameStats;