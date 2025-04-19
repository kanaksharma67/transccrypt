import { useState, useEffect, useCallback } from 'react';
import { Heart, Sun, Moon, Trophy, Bone, Fish, Carrot, Cat, Dog, Rabbit } from 'lucide-react';

// Types
type PetType = 'cat' | 'dog' | 'rabbit';

interface Achievements {
  firstFeed: boolean;
  firstPlay: boolean;
  firstSleep: boolean;
  level5: boolean;
  level10: boolean;
  perfectCare: boolean;
  petLover: boolean;
}

interface GameState {
  days: number;
  happiness: number;
  hunger: number;
  energy: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  lastFed: string | null;
  lastPlayed: string | null;
  lastSlept: string | null;
  petType: PetType;
  achievements: Achievements;
  isNight: boolean;
}

const PetCare = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    days: 0,
    happiness: 50,
    hunger: 50,
    energy: 80,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    lastFed: null,
    lastPlayed: null,
    lastSlept: null,
    petType: 'cat',
    achievements: {
      firstFeed: false,
      firstPlay: false,
      firstSleep: false,
      level5: false,
      level10: false,
      perfectCare: false,
      petLover: false
    },
    isNight: false
  });

  // UI state
  const [isSleeping, setIsSleeping] = useState(false);
  const [showPetSelection, setShowPetSelection] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [notification, setNotification] = useState('');
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [miniGameActive, setMiniGameActive] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [showFoodAnimation, setShowFoodAnimation] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedState = localStorage.getItem('petGameState');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
  }, []);

  // Save data when state changes
  useEffect(() => {
    localStorage.setItem('petGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Show notification
  const showNotificationMessage = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Feed pet
  const feedPet = () => {
    const today = new Date().toDateString();
    
    if (gameState.lastFed === today) {
      showNotificationMessage("You've already fed your pet today!");
      return;
    }

    setShowHearts(true);
    setShowFoodAnimation(true);
    setTimeout(() => {
      setShowHearts(false);
      setShowFoodAnimation(false);
    }, 2000);

    setGameState(prev => {
      const newState = {
        ...prev,
        days: prev.days + 1,
        hunger: Math.max(0, prev.hunger - 30),
        happiness: Math.min(100, prev.happiness + 5),
        lastFed: today,
        achievements: {
          ...prev.achievements,
          firstFeed: true,
          perfectCare: prev.happiness === 100 && prev.hunger === 0 && prev.energy === 100
        }
      };

      showNotificationMessage("Pet fed! Hunger decreased and happiness increased.");
      return newState;
    });
  };

  // Play with pet
  const playWithPet = () => {
    if (gameState.energy < 20) {
      showNotificationMessage("Your pet is too tired to play!");
      return;
    }

    const today = new Date().toDateString();
    if (gameState.lastPlayed === today) {
      showNotificationMessage("You've already played with your pet today!");
      return;
    }

    setShowMiniGame(true);
    setMiniGameScore(0);
    setMiniGameActive(false);
  };

  // Complete play interaction
  const completePlayInteraction = (score: number) => {
    const today = new Date().toDateString();
    const happinessGain = 10 + Math.floor(score / 2);

    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);

    setGameState(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + happinessGain),
      energy: Math.max(0, prev.energy - 10),
      hunger: Math.min(100, prev.hunger + 5),
      lastPlayed: today,
      achievements: {
        ...prev.achievements,
        firstPlay: true,
        petLover: score >= 20 || prev.achievements.petLover
      }
    }));

    showNotificationMessage(`Played with pet! Happiness increased by ${happinessGain}% but energy decreased.`);
    setShowMiniGame(false);
  };

  // Sleep
  const toggleSleep = () => {
    if (isSleeping) {
      setIsSleeping(false);
      showNotificationMessage("Your pet woke up!");
      return;
    }

    if (gameState.energy > 70) {
      showNotificationMessage("Your pet isn't tired enough to sleep!");
      return;
    }

    setIsSleeping(true);
    setGameState(prev => ({
      ...prev,
      achievements: {
        ...prev.achievements,
        firstSleep: true
      }
    }));
    showNotificationMessage("Your pet is sleeping... Zzz");
  };

  // Add XP
  const addXP = useCallback((amount: number) => {
    setGameState(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNextLevel = prev.xpToNextLevel;

      if (newXP >= prev.xpToNextLevel) {
        newLevel++;
        newXP -= prev.xpToNextLevel;
        newXPToNextLevel = Math.floor(prev.xpToNextLevel * 1.5);
        showNotificationMessage(`Level Up! Your pet is now level ${newLevel}`);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNextLevel,
        achievements: {
          ...prev.achievements,
          level5: newLevel >= 5 || prev.achievements.level5,
          level10: newLevel >= 10 || prev.achievements.level10
        }
      };
    });
  }, []);

  // Stats update timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 1),
        energy: isSleeping ? Math.min(100, prev.energy + 5) : Math.max(0, prev.energy - 1)
      }));
    }, 10000);

    return () => clearInterval(timer);
  }, [isSleeping]);

  // Day/Night cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        isNight: !prev.isNight
      }));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const getPetIcon = () => {
    switch (gameState.petType) {
      case 'dog':
        return <Dog className="w-16 h-16" />;
      case 'cat':
        return <Cat className="w-16 h-16" />;
      case 'rabbit':
        return <Rabbit className="w-16 h-16" />;
    }
  };

  const getFoodIcon = () => {
    switch (gameState.petType) {
      case 'dog':
        return <Bone className="w-8 h-8" />;
      case 'cat':
        return <Fish className="w-8 h-8" />;
      case 'rabbit':
        return <Carrot className="w-8 h-8" />;
    }
  };

  return (
    <div 
      className={`min-h-screen ${
        gameState.isNight 
          ? 'bg-gradient-to-b from-slate-900 rounded-2xl' 
          : 'bg-gradient-to-b from-slate-900 rounded-2xl'
      } p-4 transition-all duration-1000 mt-20`}
    >
      <div className="max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            gameState.isNight ? 'text-white' : 'text-white'
          } transition-colors duration-500`}>
            Pet Care Game
          </h1>
          <p className={`text-lg ${
            gameState.isNight ? 'text-gray-100' : 'text-gray-100'
          } transition-colors duration-500`}>
            Take care of your virtual pet
          </p>
        </header>

        <div className={`rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${
          gameState.isNight ? 'bg-gray-800 shadow-blue-500/20 ' : 'bg-gray-800 shadow-blue-500/20'
        }`}>
          <div className={`p-4 ${
            gameState.isNight 
              ? 'bg-gradient-to-r from-blue-900 to-purple-900' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          } text-white text-center text-xl font-semibold`}>
            Pet Care
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="flex justify-between mb-6">
              <div className="text-center transform hover:scale-110 transition-transform duration-200">
                <div className={`text-2xl font-bold ${gameState.isNight ? 'text-white' : 'text-gray-800'}`}>
                  {gameState.days}
                </div>
                <div className={`text-sm ${gameState.isNight ? 'text-gray-400' : 'text-gray-600'}`}>Days</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-200">
                <div className={`text-2xl font-bold ${gameState.isNight ? 'text-white' : 'text-gray-800'}`}>
                  {gameState.happiness}%
                </div>
                <div className={`text-sm ${gameState.isNight ? 'text-gray-400' : 'text-gray-600'}`}>Happiness</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-200">
                <div className={`text-2xl font-bold ${gameState.isNight ? 'text-white' : 'text-gray-800'}`}>
                  {gameState.hunger}%
                </div>
                <div className={`text-sm ${gameState.isNight ? 'text-gray-400' : 'text-gray-600'}`}>Hunger</div>
              </div>
            </div>

            {/* Pet Display */}
            <div className={`h-48 relative rounded-2xl mb-6 overflow-hidden ${
              gameState.isNight 
                ? 'bg-gradient-to-b from-gray-700 to-gray-800' 
                : 'bg-gradient-to-b from-gray-700 to-gray-800'
            } transition-all duration-500`}>
              <div className="absolute top-2 right-2">
                {gameState.isNight 
                  ? <Moon className="text-white animate-pulse" /> 
                  : <Sun className="text-yellow-500 animate-spin-slow" />}
              </div>
              <div className={`absolute inset-0 flex items-center justify-center ${
                isSleeping ? 'animate-bounce' : 'hover:scale-110 transform transition-transform duration-300'
              }`}>
                <div className={`${isSleeping ? 'opacity-50' : ''} transition-opacity duration-300`}>
                  {getPetIcon()}
                </div>
                {showHearts && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Heart className="text-red-500 animate-float" />
                  </div>
                )}
                {showFoodAnimation && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    {getFoodIcon()}
                  </div>
                )}
                {isSleeping && (
                  <div className="absolute -top-2 right-1/4 transform rotate-12 text-2xl animate-pulse">
                    💤
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={feedPet}
                disabled={gameState.hunger <= 0}
                className={`p-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 ${
                  gameState.isNight
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                Feed Pet
              </button>
              <button
                onClick={playWithPet}
                disabled={gameState.energy < 20}
                className={`p-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 ${
                  gameState.isNight
                    ? 'bg-gradient-to-r from-green-900 to-green-900'
                    : 'bg-gradient-to-r from-green-900 to-green-900'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                Play
              </button>
              <button
                onClick={toggleSleep}
                disabled={gameState.energy > 70 && !isSleeping}
                className={`p-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 ${
                  gameState.isNight
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isSleeping ? 'Wake Up' : 'Sleep'}
              </button>
              <button
                onClick={() => setShowPetSelection(true)}
                className={`p-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 ${
                  gameState.isNight
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700'
                    : 'bg-gradient-to-r from-orange-400 to-orange-500'
                } text-white`}
              >
                Change Pet
              </button>
            </div>
          </div>
        </div>

        {/* Achievements Button */}
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="fixed bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-200"
        >
          <Trophy size={24} />
        </button>

        {/* Notification */}
        {notification && (
          <div className="fixed mt-10 right-4 bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-0 transition-transform duration-300 animate-slide-in">
            {notification}
          </div>
        )}

        {/* Pet Selection Modal */}
        {showPetSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className={`p-6 rounded-lg ${
              gameState.isNight ? 'bg-gray-800' : 'bg-white'
            } max-w-sm w-full mx-4 transform scale-100 transition-transform duration-300 animate-fade-in`}>
              <h3 className={`text-xl font-bold mb-4 ${gameState.isNight ? 'text-white' : 'text-gray-800'}`}>
                Choose Your Pet
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {(['cat', 'dog', 'rabbit'] as PetType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedPet(type)}
                    className={`p-4 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      selectedPet === type
                        ? 'bg-blue-500 text-white'
                        : gameState.isNight
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {type === 'cat' && <Cat size={32} />}
                      {type === 'dog' && <Dog size={32} />}
                      {type === 'rabbit' && <Rabbit size={32} />}
                      <span className="capitalize">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    if (selectedPet) {
                      setGameState(prev => ({ ...prev, petType: selectedPet }));
                      setShowPetSelection(false);
                      showNotificationMessage(`Changed pet to ${selectedPet}!`);
                    }
                  }}
                  disabled={!selectedPet}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Select
                </button>
                <button
                  onClick={() => setShowPetSelection(false)}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded transform hover:scale-105 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mini Game Modal */}
        {showMiniGame && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className={`p-6 rounded-lg ${
              gameState.isNight ? 'bg-gray-800' : 'bg-white'
            } max-w-sm w-full mx-4 transform scale-100 transition-transform duration-300 animate-fade-in`}>
              <h3 className={`text-xl font-bold mb-4 ${gameState.isNight ? 'text-white' : 'text-gray-800'}`}>
                Mini Game
              </h3>
              <div className="mb-4 text-center">
                <p className={`text-lg font-bold ${gameState.isNight ? 'text-white' : 'text-gray-800'}`}>
                  Score: {miniGameScore}
                </p>
                <p className={`text-sm ${gameState.isNight ? 'text-gray-400' : 'text-gray-600'}`}>
                  {miniGameActive ? 'Click as fast as you can!' : 'Click Start to begin!'}
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    if (!miniGameActive) {
                      setMiniGameActive(true);
                      setTimeout(() => {
                        completePlayInteraction(miniGameScore);
                        setMiniGameActive(false);
                      }, 10000);
                    } else {
                      setMiniGameScore(prev => prev + 1);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200 font-bold text-lg"
                >
                  {miniGameActive ? 'Click Me!' : 'Start Game'}
                </button>
                <button
                  onClick={() => setShowMiniGame(false)}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded transform hover:scale-105 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Panel */}
        {showAchievements && (
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Achievements</h3>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(gameState.achievements).map(([key, achieved]) => (
                  <div
                    key={key}
                    className={`p-2 rounded-lg ${
                      achieved
                        ? 'bg-green-200 dark:bg-green-900'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achieved ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {achieved ? '✓' : '?'}
                      </div>
                      <div>
                        <div className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {achieved ? 'Completed!' : 'Not yet achieved'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCare;