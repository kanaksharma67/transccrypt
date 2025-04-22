
export interface PlantType {
  id: string;
  name: string;
  difficulty: string;
  description: string;
  waterFrequency: number;
  fertilizerBoost: number;
  pestChance: number;
  stages: string[];
  specialFeature?: (growth: number) => React.ReactNode;
}

export interface GameState {
  days: number;
  growth: number;
  streak: number;
  lastWatered: string | null;
  fertilized: boolean;
  pruned: boolean;
  hasPest: boolean;
  plantType: PlantType | null;
  decorations: string[];
  stellarTokens: number;
  achievements: Achievement[];
  walletConnected: boolean;
  walletAddress: string | null;
}

export interface Reward {
  streak: number;
  decoration: string;
  message: string;
  tokens?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tokenReward: number;
  verified: boolean;
}

export interface BlockchainTransaction {
  id: string;
  timestamp: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'reward' | 'achievement' | 'login';
}
