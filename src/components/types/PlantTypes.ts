export interface PlantType {
    id: string;
    name: string;
    difficulty: string;
    description: string;
    waterFrequency: number;
    fertilizerBoost: number;
    pestChance: number;
    stages: string[];
    specialFeature?: (growth: number) => JSX.Element | null;
  }
  
  export interface Reward {
    streak: number;
    decoration: string;
    message: string;
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
  }