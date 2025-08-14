import { EnergyReading, DailyStats, PlantStatus } from '@/types/energy';

export class EnergyDataSimulator {
  private generateSolarOutput(hour: number): number {
    if (hour < 6 || hour > 18) return 0;
    
    const peakHour = 12;
    const maxOutput = 150;
    const hourOffset = Math.abs(hour - peakHour);
    const efficiency = Math.max(0, 1 - (hourOffset / 6));
    const cloudFactor = 0.8 + (Math.random() * 0.4);
    
    return Math.round(maxOutput * efficiency * cloudFactor);
  }

  private generateWindOutput(): number {
    const baseOutput = 80;
    const variability = 0.6 + (Math.random() * 0.8);
    
    return Math.round(baseOutput * variability);
  }

  private generateBatteryOutput(solarOutput: number, windOutput: number): number {
    const totalProduction = solarOutput + windOutput;
    const demand = 120;
    
    if (totalProduction > demand) {
      return -Math.min(50, totalProduction - demand);
    } else {
      return Math.min(40, demand - totalProduction);
    }
  }

  generateCurrentReading(): EnergyReading {
    const now = new Date();
    const hour = now.getHours();
    
    const solar = this.generateSolarOutput(hour);
    const wind = this.generateWindOutput();
    const battery = this.generateBatteryOutput(solar, wind);
    
    return {
      timestamp: now.toISOString(),
      solar,
      wind,
      battery
    };
  }

  generateHourlyData(hours = 24): EnergyReading[] {
    const data: EnergyReading[] = [];
    const now = new Date();
    
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      
      const solar = this.generateSolarOutput(hour);
      const wind = this.generateWindOutput();
      const battery = this.generateBatteryOutput(solar, wind);
      
      data.push({
        timestamp: time.toISOString(),
        solar,
        wind,
        battery
      });
    }
    
    return data;
  }

  generateDailyStats(): DailyStats {
    const hourlyData = this.generateHourlyData(24);
    
    const totalProduction = hourlyData.reduce((sum, reading) => {
      return sum + (reading.solar + reading.wind + Math.max(0, reading.battery));
    }, 0);
    
    const peakOutput = Math.max(...hourlyData.map(reading => 
      reading.solar + reading.wind + Math.max(0, reading.battery)
    ));
    
    const maxPossibleOutput = 200;
    const efficiency = Math.round((peakOutput / maxPossibleOutput) * 100);
    
    return {
      date: new Date().toISOString().split('T')[0],
      totalProduction: Math.round(totalProduction),
      peakOutput: Math.round(peakOutput),
      efficiency: Math.min(100, efficiency)
    };
  }

  getPlantStatus(): PlantStatus {
    const currentReading = this.generateCurrentReading();
    const currentOutput = currentReading.solar + currentReading.wind + Math.max(0, currentReading.battery);
    
    return {
      isOnline: true,
      lastUpdate: new Date().toISOString(),
      currentOutput: Math.round(currentOutput)
    };
  }
}

export const energySimulator = new EnergyDataSimulator();