export interface EnergyReading {
  timestamp: string;
  solar: number;
  wind: number;
  battery: number;
}

export interface DailyStats {
  date: string;
  totalProduction: number;
  peakOutput: number;
  efficiency: number;
}

export type EnergySource = 'solar' | 'wind' | 'battery' | 'total';

interface PlantStatus {
  isOnline: boolean;
  lastUpdate: string;
  currentOutput: number;
}