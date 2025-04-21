
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, Sun, Moon, Trophy, Database, Shield, Bone, Fish, 
  Carrot, Cat, Dog, Rabbit, Bird, Turtle, Squirrel, Music, 
  VolumeX, Stars, Gift, Award, Zap, Rocket, ShieldCheck
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Types
type PetType = 'cat' | 'dog' | 'rabbit' | 'bird' | 'turtle' | 'squirrel';

interface Achievements {
  firstFeed: boolean;
  firstPlay: boolean;
  firstSleep: boolean;
  level5: boolean;
  level10: boolean;
  perfectCare: boolean;
  petLover: boolean;
  blockchainMaster: boolean;
  stellarCollector: boolean;
  screenVerified: boolean;
  miniGameMaster: boolean;
  petCollector: boolean;
  luckyStreak: boolean;
  cosmosExplorer: boolean;
}

interface MiniGame {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  highScore: number;
  unlocked: boolean;
  icon: React.ReactNode;
}

interface Accessory {
  id: string;
  name: string;
  type: 'hat' | 'collar' | 'toy' | 'background';
  price: number;
  owned: boolean;
  equipped: boolean;
  image: string;
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
  stellarTokens: number;
  achievementsVerified: boolean;
  blockchainTransactions: Array<{id: string, timestamp: string, type: string, amount: number}>;
  miniGames: MiniGame[];
  accessories: Accessory[];
  lastDailyBonus: string | null;
  dailyStreak: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  equippedAccessories: {
    hat: string | null;
    collar: string | null;
    toy: string | null;
    background: string | null;
  };
}

const SOUNDS = {
  click: new Audio('/sounds/click.mp3'),
  feed: new Audio('/sounds/feed.mp3'),
  levelUp: new Audio('/sounds/level-up.mp3'),
  token: new Audio('/sounds/token.mp3'),
  achievement: new Audio('/sounds/achievement.mp3'),
  background: new Audio('/sounds/background-music.mp3')
};

const StellarVerseGame = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
      petLover: false,
      blockchainMaster: false,
      stellarCollector: false,
      screenVerified: false,
      miniGameMaster: false,
      petCollector: false,
      luckyStreak: false,
      cosmosExplorer: false
    },
    isNight: false,
    stellarTokens: 0,
    achievementsVerified: false,
    blockchainTransactions: [],
    miniGames: [
      { 
        id: 'clicker', 
        name: 'Speed Clicker', 
        description: 'Click as fast as you can in 10 seconds!',
        difficulty: 'easy',
        highScore: 0,
        unlocked: true,
        icon: <Zap size={24} />
      },
      { 
        id: 'memory', 
        name: 'Space Memory', 
        description: 'Match the stars in the cosmos',
        difficulty: 'medium',
        highScore: 0,
        unlocked: false,
        icon: <Stars size={24} />
      },
      { 
        id: 'rocket', 
        name: 'Stellar Rocket', 
        description: 'Pilot your rocket through asteroid fields',
        difficulty: 'hard',
        highScore: 0,
        unlocked: false,
        icon: <Rocket size={24} />
      }
    ],
    accessories: [
      {
        id: 'hat1',
        name: 'Space Helmet',
        type: 'hat',
        price: 25,
        owned: false,
        equipped: false,
        image: '👩‍🚀'
      },
      {
        id: 'collar1',
        name: 'Star Collar',
        type: 'collar',
        price: 15,
        owned: false,
        equipped: false,
        image: '✨'
      },
      {
        id: 'toy1',
        name: 'Cosmic Ball',
        type: 'toy',
        price: 20,
        owned: false,
        equipped: false,
        image: '🔮'
      },
      {
        id: 'bg1',
        name: 'Galaxy Background',
        type: 'background',
        price: 50,
        owned: false,
        equipped: false,
        image: '🌌'
      }
    ],
    lastDailyBonus: null,
    dailyStreak: 0,
    soundEnabled: true,
    musicEnabled: false,
    equippedAccessories: {
      hat: null,
      collar: null,
      toy: null,
      background: null
    }
  });

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
  const [showBlockchainPanel, setShowBlockchainPanel] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTokenAnimation, setShowTokenAnimation] = useState(false);
  const [currentMiniGame, setCurrentMiniGame] = useState<string | null>(null);
  const [showMiniGamesMenu, setShowMiniGamesMenu] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showPetAnimation, setShowPetAnimation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dailyBonusAvailable, setDailyBonusAvailable] = useState(false);

  const petContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('stellarVersePetState');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    try {
      const stateToPersist = { ...gameState };
      
      if (stateToPersist.miniGames) {
        stateToPersist.miniGames = stateToPersist.miniGames.map(game => ({
          ...game,
          icon: undefined
        }));
      }
      
      localStorage.setItem('stellarVersePetState', JSON.stringify(stateToPersist));
      
      const today = new Date().toDateString();
      if (gameState.lastDailyBonus !== today) {
        setDailyBonusAvailable(true);
      } else {
        setDailyBonusAvailable(false);
      }
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }, [gameState]);

  useEffect(() => {
    SOUNDS.background.loop = true;
    
    if (gameState.musicEnabled) {
      SOUNDS.background.play().catch(e => console.log("Audio playback prevented:", e));
    } else {
      SOUNDS.background.pause();
    }
    
    return () => {
      SOUNDS.background.pause();
    };
  }, [gameState.musicEnabled]);

  const playSound = (sound: 'click' | 'feed' | 'levelUp' | 'token' | 'achievement') => {
    if (gameState.soundEnabled) {
      SOUNDS[sound].currentTime = 0;
      SOUNDS[sound].play().catch(e => console.log("Audio playback prevented:", e));
    }
  };

  const toggleMusic = () => {
    setGameState(prev => ({
      ...prev,
      musicEnabled: !prev.musicEnabled
    }));
  };
  
  const toggleSound = () => {
    setGameState(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  const generateTransactionHash = () => {
    return 'tx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const recordBlockchainTransaction = (type: string, amount: number) => {
    const txHash = generateTransactionHash();
    const timestamp = new Date().toISOString();
    
    setGameState(prev => ({
      ...prev,
      blockchainTransactions: [
        { 
          id: txHash, 
          timestamp: timestamp, 
          type: type, 
          amount: amount 
        },
        ...prev.blockchainTransactions.slice(0, 49)
      ]
    }));
    
    return {txHash, timestamp};
  };

  const awardStellarTokens = (amount: number, reason: string) => {
    const {txHash} = recordBlockchainTransaction(`${reason}`, amount);
    
    setShowTokenAnimation(true);
    setTimeout(() => setShowTokenAnimation(false), 3000);
    
    setGameState(prev => {
      const newStellarTokens = prev.stellarTokens + amount;
      const stellarCollector = newStellarTokens >= 50 || prev.achievements.stellarCollector;
      const blockchainMaster = prev.blockchainTransactions.length >= 20 || prev.achievements.blockchainMaster;
      
      playSound('token');
      showNotificationMessage(`Earned ${amount} Stellar tokens! Transaction recorded on Monad blockchain.`);
      
      return {
        ...prev,
        stellarTokens: newStellarTokens,
        achievements: {
          ...prev.achievements,
          stellarCollector,
          blockchainMaster
        }
      };
    });
    
    return txHash;
  };

  const claimDailyBonus = () => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    setGameState(prev => {
      let newStreak = prev.dailyStreak;
      if (prev.lastDailyBonus === yesterdayString) {
        newStreak += 1;
      } else if (prev.lastDailyBonus !== today) {
        newStreak = 1;
      }
      
      const streakBonus = Math.min(5, Math.floor(newStreak / 3));
      const bonusAmount = 5 + streakBonus;
      
      setTimeout(() => {
        awardStellarTokens(bonusAmount, "DAILY_BONUS");
        toast({
          title: "Daily Bonus Claimed!",
          description: `You received ${bonusAmount} Stellar tokens. Current streak: ${newStreak} days`,
        });
      }, 500);
      
      return {
        ...prev,
        lastDailyBonus: today,
        dailyStreak: newStreak
      };
    });
    
    setDailyBonusAvailable(false);
  };

  const verifyAchievements = () => {
    setIsVerifying(true);
    playSound('click');
    
    setTimeout(() => {
      setIsVerifying(false);
      
      setGameState(prev => {
        if (prev.achievementsVerified) {
          showNotificationMessage("Achievements already verified by Screenpipe!");
          return prev;
        }
        
        recordBlockchainTransaction("ACHIEVEMENT_VERIFICATION", 5);
        playSound('achievement');
        showNotificationMessage("Achievements verified by Screenpipe! Received 5 Stellar tokens.");
        
        return {
          ...prev,
          achievementsVerified: true,
          stellarTokens: prev.stellarTokens + 5,
          achievements: {
            ...prev.achievements,
            screenVerified: true
          }
        };
      });
    }, 3000);
  };

  const buyAccessory = (accessoryId: string) => {
    playSound('click');
    
    setGameState(prev => {
      const accessoryIndex = prev.accessories.findIndex(acc => acc.id === accessoryId);
      
      if (accessoryIndex === -1) return prev;
      
      const accessory = prev.accessories[accessoryIndex];
      
      if (accessory.owned) {
        showNotificationMessage(`You already own the ${accessory.name}!`);
        return prev;
      }
      
      if (prev.stellarTokens < accessory.price) {
        showNotificationMessage(`Not enough Stellar tokens to buy ${accessory.name}!`);
        return prev;
      }
      
      const txHash = recordBlockchainTransaction("PURCHASE", accessory.price);
      showNotificationMessage(`Purchased ${accessory.name} for ${accessory.price} Stellar tokens!`);
      
      const updatedAccessories = [...prev.accessories];
      updatedAccessories[accessoryIndex] = {
        ...accessory,
        owned: true
      };
      
      return {
        ...prev,
        stellarTokens: prev.stellarTokens - accessory.price,
        accessories: updatedAccessories
      };
    });
  };

  const toggleAccessory = (accessoryId: string) => {
    playSound('click');
    
    setGameState(prev => {
      const accessoryIndex = prev.accessories.findIndex(acc => acc.id === accessoryId);
      
      if (accessoryIndex === -1 || !prev.accessories[accessoryIndex].owned) return prev;
      
      const accessory = prev.accessories[accessoryIndex];
      const equipped = !accessory.equipped;
      
      const updatedAccessories = [...prev.accessories];
      
      if (equipped) {
        updatedAccessories.forEach((acc, idx) => {
          if (acc.type === accessory.type && idx !== accessoryIndex) {
            updatedAccessories[idx] = { ...acc, equipped: false };
          }
        });
      }
      
      updatedAccessories[accessoryIndex] = {
        ...accessory,
        equipped
      };
      
      const equippedAccessories = { ...prev.equippedAccessories };
      if (equipped) {
        equippedAccessories[accessory.type as keyof typeof equippedAccessories] = accessory.id;
      } else {
        equippedAccessories[accessory.type as keyof typeof equippedAccessories] = null;
      }
      
      return {
        ...prev,
        accessories: updatedAccessories,
        equippedAccessories
      };
    });
  };

  const unlockMiniGame = (gameId: string) => {
    playSound('click');
    
    setGameState(prev => {
      const gameIndex = prev.miniGames.findIndex(game => game.id === gameId);
      
      if (gameIndex === -1 || prev.miniGames[gameIndex].unlocked) return prev;
      
      const game = prev.miniGames[gameIndex];
      const cost = game.difficulty === 'medium' ? 15 : 30;
      
      if (prev.stellarTokens < cost) {
        showNotificationMessage(`Not enough Stellar tokens to unlock this game!`);
        return prev;
      }
      
      const updatedGames = [...prev.miniGames];
      updatedGames[gameIndex] = {
        ...game,
        unlocked: true
      };
      
      recordBlockchainTransaction("GAME_UNLOCK", cost);
      showNotificationMessage(`Unlocked ${game.name} for ${cost} Stellar tokens!`);
      
      return {
        ...prev,
        stellarTokens: prev.stellarTokens - cost,
        miniGames: updatedGames
      };
    });
  };

  const showNotificationMessage = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const feedPet = () => {
    const today = new Date().toDateString();
    
    if (gameState.lastFed === today) {
      showNotificationMessage("You've already fed your pet today!");
      return;
    }

    playSound('feed');
    setShowHearts(true);
    setShowFoodAnimation(true);
    setTimeout(() => {
      setShowHearts(false);
      setShowFoodAnimation(false);
    }, 2000);

    setGameState(prev => {
      const firstTimeFeeding = !prev.achievements.firstFeed;
      const perfectCare = prev.happiness >= 95 && prev.hunger <= 10 && prev.energy >= 90;
      
      if (firstTimeFeeding) {
        setTimeout(() => awardStellarTokens(5, "FIRST_FEEDING"), 1000);
      }
      
      if (perfectCare && !prev.achievements.perfectCare) {
        setTimeout(() => {
          awardStellarTokens(20, "PERFECT_CARE");
          playSound('achievement');
        }, 1500);
      }

      const newState = {
        ...prev,
        days: prev.days + 1,
        hunger: Math.max(0, prev.hunger - 30),
        happiness: Math.min(100, prev.happiness + 5),
        lastFed: today,
        achievements: {
          ...prev.achievements,
          firstFeed: true,
          perfectCare: perfectCare || prev.achievements.perfectCare
        }
      };

      showNotificationMessage("Pet fed! Hunger decreased and happiness increased.");
      return newState;
    });
  };

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

    playSound('click');
    setShowMiniGamesMenu(true);
  };

  const startMiniGame = (gameId: string) => {
    playSound('click');
    const game = gameState.miniGames.find(g => g.id === gameId);
    
    if (!game || !game.unlocked) {
      return;
    }
    
    setCurrentMiniGame(gameId);
    setShowMiniGame(true);
    setMiniGameScore(0);
    setMiniGameActive(false);
    setShowMiniGamesMenu(false);
  };

  const completePlayInteraction = (gameId: string, score: number) => {
    const today = new Date().toDateString();
    const happinessGain = 10 + Math.floor(score / 2);
    const stellarReward = Math.floor(score / 5);

    playSound('levelUp');
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);

    setGameState(prev => {
      const firstTimePlay = !prev.achievements.firstPlay;
      const petLoverAchievement = score >= 20 && !prev.achievements.petLover;
      const gameIndex = prev.miniGames.findIndex(g => g.id === gameId);
      
      let updatedMiniGames = [...prev.miniGames];
      if (gameIndex !== -1 && score > prev.miniGames[gameIndex].highScore) {
        updatedMiniGames = prev.miniGames.map((g, idx) => 
          idx === gameIndex ? { ...g, highScore: score } : g
        );
      }
      
      const highScores = updatedMiniGames.filter(g => g.unlocked && g.highScore > 0);
      const miniGameMaster = highScores.length >= 3 && 
        highScores.every(g => g.highScore >= 10) || 
        prev.achievements.miniGameMaster;
      
      if (firstTimePlay) {
        setTimeout(() => awardStellarTokens(5, "FIRST_PLAY"), 1000);
      }
      
      if (petLoverAchievement) {
        setTimeout(() => {
          awardStellarTokens(10, "PET_LOVER");
          playSound('achievement');
        }, 1500);
      }
      
      if (miniGameMaster && !prev.achievements.miniGameMaster) {
        setTimeout(() => {
          awardStellarTokens(25, "MINI_GAME_MASTER");
          playSound('achievement');
          toast({
            title: "Achievement Unlocked!",
            description: "Mini-Game Master: High scores in all games!",
          });
        }, 2000);
      }

      if (stellarReward > 0) {
        setTimeout(() => awardStellarTokens(stellarReward, "PLAY_REWARD"), 1000);
      }
      
      return {
        ...prev,
        happiness: Math.min(100, prev.happiness + happinessGain),
        energy: Math.max(0, prev.energy - 10),
        hunger: Math.min(100, prev.hunger + 5),
        lastPlayed: today,
        miniGames: updatedMiniGames,
        achievements: {
          ...prev.achievements,
          firstPlay: true,
          petLover: score >= 20 || prev.achievements.petLover,
          miniGameMaster
        }
      };
    });

    showNotificationMessage(`Played with pet! Happiness increased by ${happinessGain}%. ${stellarReward > 0 ? `Earned ${stellarReward} Stellar tokens!` : ''}`);
    setShowMiniGame(false);
    setCurrentMiniGame(null);
  };

  const toggleSleep = () => {
    playSound('click');
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
    
    setGameState(prev => {
      const firstTimeSleep = !prev.achievements.firstSleep;
      
      if (firstTimeSleep) {
        setTimeout(() => awardStellarTokens(5, "FIRST_SLEEP"), 1000);
      }
      
      return {
        ...prev,
        achievements: {
          ...prev.achievements,
          firstSleep: true
        }
      };
    });
    
    showNotificationMessage("Your pet is sleeping... Zzz");
  };

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
        playSound('levelUp');
        
        setTimeout(() => awardStellarTokens(newLevel * 2, "LEVEL_UP"), 1000);
      }

      const reachedLevel5 = newLevel >= 5 && !prev.achievements.level5;
      const reachedLevel10 = newLevel >= 10 && !prev.achievements.level10;
      
      if (reachedLevel5) {
        setTimeout(() => {
          awardStellarTokens(15, "LEVEL_5_ACHIEVEMENT");
          playSound('achievement');
        }, 1500);
      }
      
      if (reachedLevel10) {
        setTimeout(() => {
          awardStellarTokens(30, "LEVEL_10_ACHIEVEMENT");
          playSound('achievement');
        }, 1500);
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

  const activatePetAnimation = () => {
    if (petContainerRef.current) {
      setShowPetAnimation(true);
      setTimeout(() => setShowPetAnimation(false), 2000);
      playSound('click');
    }
  };

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

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        isNight: !prev.isNight
      }));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      addXP(5);
    }, 60000);

    return () => clearInterval(timer);
  }, [addXP]);

  useEffect(() => {
    const petTypes = new Set();
    
    try {
      const savedState = localStorage.getItem('stellarVersePetHistory');
      if (savedState) {
        const history = JSON.parse(savedState);
        history.forEach((pet: string) => petTypes.add(pet));
      }
      
      petTypes.add(gameState.petType);
      
      localStorage.setItem('stellarVersePetHistory', JSON.stringify(Array.from(petTypes)));
      
      if (petTypes.size >= 3 && !gameState.achievements.petCollector) {
        setGameState(prev => ({
          ...prev,
          achievements: {
            ...prev.achievements,
            petCollector: true
          }
        }));
        
        setTimeout(() => {
          awardStellarTokens(20, "PET_COLLECTOR");
          playSound('achievement');
          toast({
            title: "Achievement Unlocked!",
            description: "Pet Collector: You've owned 3 different types of pets!",
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error handling pet history:', error);
    }
  }, [gameState.petType]);

  const getPetIcon = () => {
    switch (gameState.petType) {
      case 'dog':
        return <Dog className={`w-16 h-16 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white`} />;
      case 'cat':
        return <Cat className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white`} />;
      case 'rabbit':
        return <Rabbit className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white`} />;
      case 'bird':
        return <Bird className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white`} />;
      case 'turtle':
        return <Turtle className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white`} />;
      case 'squirrel':
        return <Squirrel className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white`} />;
    }
  };

  const getFoodIcon = () => {
    switch (gameState.petType) {
      case 'dog':
        return <Bone className="w-8 h-8" />;
      case 'cat':
        return <Fish className="w-8 h-8" />;
      case 'rabbit':
      case 'squirrel':
        return <Carrot className="w-8 h-8" />;
      case 'bird':
      case 'turtle':
        return <Fish className="w-8 h-8" />;
    }
  };

  const getEquippedAccessories = () => {
    return gameState.accessories
      .filter(acc => acc.owned && acc.equipped)
      .map(acc => (
        <div 
          key={acc.id} 
          className={`absolute ${acc.type === 'hat' ? 'top-[-15px] left-1/2 transform -translate-x-1/2' : 
            acc.type === 'collar' ? 'bottom-[-5px] left-1/2 transform -translate-x-1/2' : 
            acc.type === 'toy' ? 'bottom-[5px] right-[-15px]' : 'hidden'}`}
        >
          <span className="text-2xl">{acc.image}</span>
        </div>
      ));
  };

  const getBackgroundAccessory = () => {
    const bgAccessory = gameState.accessories.find(
      acc => acc.type === 'background' && acc.owned && acc.equipped
    );
    
    return bgAccessory ? bgAccessory.image : null;
  };

  return (
    <div className={`min-h-screen ${isMobile ? 'pb-16' : ''} bg-gradient-to-b from-[#0a1128] to-[#1a2151] p-4 flex flex-col items-center justify-center relative`}>
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <button
          onClick={toggleSound}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            gameState.soundEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {gameState.soundEnabled ? (
            <VolumeX size={20} className="text-white" />
          ) : (
            <VolumeX size={20} className="text-white" />
          )}
        </button>
        <button
          onClick={toggleMusic}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            gameState.musicEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          <Music size={20} className="text-white" />
        </button>
      </div>
      
      {showTokenAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="animate-float-up text-6xl font-bold text-yellow-400 flex items-center">
            <span className="mr-2">+</span>
            <span className="text-yellow-300">★</span>
          </div>
        </div>
      )}
      
      {dailyBonusAvailable && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={claimDailyBonus}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 animate-pulse shadow-lg"
          >
            <Gift size={20} />
            <span>Daily Bonus!</span>
          </button>
        </div>
      )}
      
      <div className={`max-w-md w-full mx-auto relative ${isMobile ? 'px-2' : ''}`}>
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">StellarVerse Pet</h1>
          <p className="text-blue-200">Day {gameState.days} | Level {gameState.level}</p>
        </header>
        
        <div 
          ref={petContainerRef}
          className={`relative flex flex-col items-center justify-center p-8 mb-4 rounded-xl border-4 ${
            gameState.isNight ? 'bg-[#101835] border-[#2a3366]' : 'bg-[#1e3a8a] border-[#3b82f6]'
          } transition-all duration-1000 ${showPetAnimation ? 'animate-bounce' : ''}`}
          onClick={activatePetAnimation}
        >
          <div className="absolute top-2 right-2">
            {gameState.isNight ? <Moon className="text-white" /> : <Sun className="text-yellow-300" />}
          </div>
          
          {getBackgroundAccessory() && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20 text-8xl pointer-events-none">
              {getBackgroundAccessory()}
            </div>
          )}
          
          <div className="relative mb-4">
            {getEquippedAccessories()}
            <div className={`p-4 rounded-full ${gameState.isNight ? 'bg-[#182142]' : 'bg-[#2b4db0]'} ${isSleeping ? 'opacity-70' : ''}`}>
              {getPetIcon()}
            </div>
            
            {showHearts && (
              <div className="absolute top-[-20px] right-[-20px] animate-bounce">
                <Heart className="text-red-500 h-6 w-6 fill-red-500" />
              </div>
            )}
            
            {showFoodAnimation && (
              <div className="absolute bottom-[-10px] left-[-20px] animate-pulse">
                {getFoodIcon()}
              </div>
            )}
            
            {isSleeping && (
              <div className="absolute top-0 right-0">
                <span className="text-2xl">💤</span>
              </div>
            )}
          </div>
          
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-green-500" 
              style={{width: `${(gameState.xp / gameState.xpToNextLevel) * 100}%`}}
            ></div>
          </div>
          <div className="text-xs text-white mb-4">XP: {gameState.xp}/{gameState.xpToNextLevel}</div>
          
          <div className="w-full space-y-3">
            <div className="flex items-center">
              <span className="text-white w-24">Happiness</span>
              <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${gameState.happiness > 70 ? 'bg-green-500' : gameState.happiness > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{width: `${gameState.happiness}%`}}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-white w-24">Hunger</span>
              <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${gameState.hunger < 30 ? 'bg-green-500' : gameState.hunger < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{width: `${gameState.hunger}%`}}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-white w-24">Energy</span>
              <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${gameState.energy > 70 ? 'bg-green-500' : gameState.energy > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{width: `${gameState.energy}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {notification && (
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-3 rounded-lg text-white text-center mb-4 animate-fade-in">
            {notification}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            onClick={feedPet}
            disabled={gameState.lastFed === new Date().toDateString()}
            className={`flex items-center justify-center ${gameState.lastFed === new Date().toDateString() ? 'opacity-50' : 'hover:bg-green-600'} bg-green-500`}
          >
            <Bone className="mr-2 h-5 w-5" />
            Feed
          </Button>
          
          <Button 
            onClick={playWithPet}
            disabled={gameState.lastPlayed === new Date().toDateString() || gameState.energy < 20}
            className={`flex items-center justify-center ${gameState.lastPlayed === new Date().toDateString() || gameState.energy < 20 ? 'opacity-50' : 'hover:bg-purple-600'} bg-purple-500`}
          >
            <Stars className="mr-2 h-5 w-5" />
            Play
          </Button>
          
          <Button 
            onClick={toggleSleep}
            className={`flex items-center justify-center ${isSleeping ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Moon className="mr-2 h-5 w-5" />
            {isSleeping ? 'Wake Up' : 'Sleep'}
          </Button>
          
          <Button 
            onClick={() => setShowPetSelection(true)}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
          >
            <Cat className="mr-2 h-5 w-5" />
            Change Pet
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-yellow-900/30 px-3 py-1 rounded-lg">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-white">{gameState.stellarTokens}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowShop(true)}
              variant="outline" 
              className="bg-purple-900/50 border-purple-500/50 text-white hover:bg-purple-800"
              size="sm"
            >
              Shop
            </Button>
            
            <Button 
              onClick={verifyAchievements}
              disabled={isVerifying || gameState.achievementsVerified}
              className={`flex items-center gap-1 font-semibold ${gameState.achievementsVerified
                ? "bg-green-700 border-green-500/80 text-white cursor-default"
                : isVerifying
                  ? "bg-blue-400 border-blue-400/80 text-white cursor-progress"
                  : "bg-[#8B5CF6] border-[#7E69AB] text-white hover:bg-[#9b87f5]"} border-2 px-4 py-2 rounded-md transition-colors duration-150`}
              size="sm"
              style={{ minWidth: 60 }}
            >
              <ShieldCheck size={16} className="mr-1" />
              {isVerifying
                ? "Verifying..."
                : gameState.achievementsVerified
                  ? "Verified"
                  : "Verify via Screenpipe"}
            </Button>
            
            <Button 
              onClick={() => setShowAchievements(true)}
              variant="outline" 
              className="bg-blue-900/50 border-blue-500/50 text-white hover:bg-blue-800"
              size="sm"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Achievements
            </Button>
            
            <Button 
              onClick={() => setShowBlockchainPanel(true)}
              variant="outline" 
              className="bg-green-900/50 border-green-500/50 text-white hover:bg-green-800"
              size="sm"
            >
              <Database className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {showPetSelection && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#1a2151] border-2 border-blue-500 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white">Choose Your Pet</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button
                onClick={() => setSelectedPet('cat')}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  selectedPet === 'cat' ? 'bg-blue-600' : 'bg-[#2a3366] hover:bg-[#3b4377]'
                }`}
              >
                <Cat className="h-10 w-10 text-white" />
                <span className="text-white mt-2">Cat</span>
              </button>
              
              <button
                onClick={() => setSelectedPet('dog')}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  selectedPet === 'dog' ? 'bg-blue-600' : 'bg-[#2a3366] hover:bg-[#3b4377]'
                }`}
              >
                <Dog className="h-10 w-10 text-white" />
                <span className="text-white mt-2">Dog</span>
              </button>
              
              <button
                onClick={() => setSelectedPet('rabbit')}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  selectedPet === 'rabbit' ? 'bg-blue-600' : 'bg-[#2a3366] hover:bg-[#3b4377]'
                }`}
              >
                <Rabbit className="h-10 w-10 text-white" />
                <span className="text-white mt-2">Rabbit</span>
              </button>
              
              <button
                onClick={() => setSelectedPet('bird')}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  selectedPet === 'bird' ? 'bg-blue-600' : 'bg-[#2a3366] hover:bg-[#3b4377]'
                }`}
              >
                <Bird className="h-10 w-10 text-white" />
                <span className="text-white mt-2">Bird</span>
              </button>
              
              <button
                onClick={() => setSelectedPet('turtle')}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  selectedPet === 'turtle' ? 'bg-blue-600' : 'bg-[#2a3366] hover:bg-[#3b4377]'
                }`}
              >
                <Turtle className="h-10 w-10 text-white" />
                <span className="text-white mt-2">Turtle</span>
              </button>
              
              <button
                onClick={() => setSelectedPet('squirrel')}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  selectedPet === 'squirrel' ? 'bg-blue-600' : 'bg-[#2a3366] hover:bg-[#3b4377]'
                }`}
              >
                <Squirrel className="h-10 w-10 text-white" />
                <span className="text-white mt-2">Squirrel</span>
              </button>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowPetSelection(false)}
                variant="outline"
                className="border-gray-500 text-white"
              >
                Cancel
              </Button>
              
              <Button
                onClick={() => {
                  if (selectedPet) {
                    setGameState(prev => ({ ...prev, petType: selectedPet }));
                    setShowPetSelection(false);
                    playSound('click');
                  }
                }}
                disabled={!selectedPet}
                className="bg-blue-600"
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showShop && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#1a2151] border-2 border-purple-500 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">StellarVerse Shop</h2>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-white">{gameState.stellarTokens}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-4 max-h-[50vh] overflow-y-auto p-2">
              {gameState.accessories.map(accessory => (
                <div 
                  key={accessory.id}
                  className="bg-[#2a3366] p-3 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{accessory.image}</span>
                    <div>
                      <p className="text-white font-medium">{accessory.name}</p>
                      <p className="text-blue-300 text-sm">{accessory.type}</p>
                    </div>
                  </div>
                  
                  <div>
                    {accessory.owned ? (
                      <Button 
                        onClick={() => toggleAccessory(accessory.id)}
                        variant="outline" 
                        size="sm"
                        className={`min-w-24 ${
                          accessory.equipped 
                            ? 'bg-green-700 border-green-500' 
                            : 'bg-blue-900/40 border-blue-500/50'
                        }`}
                      >
                        {accessory.equipped ? 'Equipped' : 'Equip'}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => buyAccessory(accessory.id)}
                        variant="outline" 
                        size="sm"
                        disabled={gameState.stellarTokens < accessory.price}
                        className={`min-w-24 bg-purple-900/40 border-purple-500/50 ${
                          gameState.stellarTokens < accessory.price ? 'opacity-50' : ''
                        }`}
                      >
                        <span className="text-yellow-400 mr-1">★</span>
                        {accessory.price}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="border-t border-blue-500/30 pt-4 mt-2">
                <h3 className="text-xl font-bold text-white mb-2">Mini-Games</h3>
                
                {gameState.miniGames.filter(game => !game.unlocked).map(game => (
                  <div 
                    key={game.id}
                    className="bg-[#2a3366] p-3 rounded-lg flex justify-between items-center mb-3"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-900/50 rounded-lg mr-3">
                        {game.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{game.name}</p>
                        <p className="text-blue-300 text-sm">{game.description}</p>
                        <p className="text-xs text-yellow-300 mt-1">Difficulty: {game.difficulty}</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => unlockMiniGame(game.id)}
                      variant="outline" 
                      size="sm"
                      disabled={
                        gameState.stellarTokens < (game.difficulty === 'medium' ? 15 : 30)
                      }
                      className="min-w-24 bg-purple-900/40 border-purple-500/50"
                    >
                      <span className="text-yellow-400 mr-1">★</span>
                      {game.difficulty === 'medium' ? 15 : 30}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => setShowShop(false)}
                className="bg-purple-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showAchievements && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#1a2151] border-2 border-blue-500 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <Button 
                onClick={verifyAchievements}
                disabled={isVerifying || gameState.achievementsVerified}
                className="bg-green-600 text-xs"
                size="sm"
              >
                {isVerifying ? 'Verifying...' : gameState.achievementsVerified ? 'Verified' : 'Verify on Blockchain'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto p-2">
              <div className={`p-3 rounded-lg ${gameState.achievements.firstFeed ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.firstFeed ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.firstFeed ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.firstFeed ? 'text-green-300' : 'text-gray-400'}`}>First Feeding</p>
                    <p className="text-xs text-gray-400">Feed your pet for the first time</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.firstPlay ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.firstPlay ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.firstPlay ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.firstPlay ? 'text-green-300' : 'text-gray-400'}`}>First Play</p>
                    <p className="text-xs text-gray-400">Play with your pet for the first time</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.firstSleep ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.firstSleep ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.firstSleep ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.firstSleep ? 'text-green-300' : 'text-gray-400'}`}>First Rest</p>
                    <p className="text-xs text-gray-400">Let your pet sleep for the first time</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.level5 ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.level5 ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.level5 ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.level5 ? 'text-green-300' : 'text-gray-400'}`}>Level 5 Reached</p>
                    <p className="text-xs text-gray-400">Reach level 5 with your pet</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.level10 ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.level10 ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.level10 ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.level10 ? 'text-green-300' : 'text-gray-400'}`}>Level 10 Master</p>
                    <p className="text-xs text-gray-400">Reach level 10 with your pet</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.perfectCare ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.perfectCare ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.perfectCare ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.perfectCare ? 'text-green-300' : 'text-gray-400'}`}>Perfect Care</p>
                    <p className="text-xs text-gray-400">Keep all stats at optimal levels</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.petLover ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.petLover ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.petLover ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.petLover ? 'text-green-300' : 'text-gray-400'}`}>Pet Lover</p>
                    <p className="text-xs text-gray-400">Score 20+ points in a mini-game</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.blockchainMaster ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.blockchainMaster ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.blockchainMaster ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.blockchainMaster ? 'text-green-300' : 'text-gray-400'}`}>Blockchain Master</p>
                    <p className="text-xs text-gray-400">Record 20 blockchain transactions</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.stellarCollector ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.stellarCollector ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.stellarCollector ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.stellarCollector ? 'text-green-300' : 'text-gray-400'}`}>Stellar Collector</p>
                    <p className="text-xs text-gray-400">Collect 50 Stellar tokens</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.screenVerified ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.screenVerified ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.screenVerified ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.screenVerified ? 'text-green-300' : 'text-gray-400'}`}>Screen Verified</p>
                    <p className="text-xs text-gray-400">Verify achievements on blockchain</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.miniGameMaster ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.miniGameMaster ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.miniGameMaster ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.miniGameMaster ? 'text-green-300' : 'text-gray-400'}`}>Mini-Game Master</p>
                    <p className="text-xs text-gray-400">Get high scores in all mini-games</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.petCollector ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.petCollector ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.petCollector ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.petCollector ? 'text-green-300' : 'text-gray-400'}`}>Pet Collector</p>
                    <p className="text-xs text-gray-400">Own at least 3 different pet types</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${gameState.achievements.luckyStreak ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${gameState.achievements.luckyStreak ? 'bg-green-900' : 'bg-gray-700'}`}>
                    {gameState.achievements.luckyStreak ? <Award className="text-yellow-400" /> : <Award className="text-gray-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${gameState.achievements.luckyStreak ? 'text-green-300' : 'text-gray-400'}`}>Lucky Streak</p>
                    <p className="text-xs text-gray-400">Claim daily bonus 7 days in a row</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setShowAchievements(false)}
                className="bg-blue-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showBlockchainPanel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#1a2151] border-2 border-green-500 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Database className="mr-2" />
              Blockchain Transactions
            </h2>
            
            <div className="max-h-[50vh] overflow-y-auto bg-[#0a1128] rounded-lg p-2">
              {gameState.blockchainTransactions.length === 0 ? (
                <div className="text-gray-400 text-center py-4">No transactions recorded yet</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-right py-2 px-2">Amount</th>
                      <th className="text-right py-2 px-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.blockchainTransactions.map(tx => (
                      <tr key={tx.id} className="border-b border-gray-800 text-white">
                        <td className="py-2 px-2">{tx.type}</td>
                        <td className="text-right py-2 px-2">
                          <span className={tx.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                          </span>
                        </td>
                        <td className="text-right py-2 px-2 text-gray-400">
                          {new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setShowBlockchainPanel(false)}
                className="bg-green-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showMiniGamesMenu && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#1a2151] border-2 border-purple-500 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Choose a Mini-Game</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              {gameState.miniGames.filter(game => game.unlocked).map(game => (
                <button
                  key={game.id}
                  onClick={() => startMiniGame(game.id)}
                  className="bg-[#2a3366] p-4 rounded-lg flex justify-between items-center hover:bg-[#3b4377]"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-900/50 rounded-lg mr-3">
                      {game.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">{game.name}</p>
                      <p className="text-blue-300 text-sm">{game.description}</p>
                      <p className="text-xs text-yellow-300 mt-1">
                        High Score: {game.highScore} | Difficulty: {game.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2">
                    <Rocket className="h-5 w-5 text-purple-300" />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowMiniGamesMenu(false)}
                className="bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showMiniGame && currentMiniGame === 'clicker' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#1a2151] border-2 border-purple-500 rounded-xl p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Speed Clicker</h2>
            
            {!miniGameActive ? (
              <>
                <p className="text-white mb-6">Click as fast as you can in 10 seconds!</p>
                <Button
                  onClick={() => {
                    setMiniGameActive(true);
                    setMiniGameScore(0);
                    
                    setTimeout(() => {
                      setMiniGameActive(false);
                      completePlayInteraction('clicker', miniGameScore);
                    }, 10000);
                  }}
                  className="bg-purple-600 text-white mx-auto px-8 py-3 text-lg"
                >
                  Start
                </Button>
              </>
            ) : (
              <>
                <div className="text-6xl font-bold text-white mb-6">{miniGameScore}</div>
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-8">
                  <div className="h-full bg-purple-500 transition-all duration-100" style={{ width: '100%' }}></div>
                </div>
                <Button
                  onClick={() => {
                    setMiniGameScore(prev => prev + 1);
                    playSound('click');
                  }}
                  className="bg-purple-600 text-white mx-auto px-12 py-6 text-xl animate-pulse"
                >
                  CLICK!
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StellarVerseGame;
