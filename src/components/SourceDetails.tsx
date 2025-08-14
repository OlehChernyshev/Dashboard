'use client';

import { EnergySource, EnergyReading, DailyStats } from '@/types/energy';
import { formatPower, formatEnergy } from '@/lib/utils';

interface SourceDetailsProps {
  selectedSource: EnergySource;
  currentReading: EnergyReading;
  hourlyData: EnergyReading[];
  dailyStats: DailyStats;
}

export default function SourceDetails({ selectedSource, currentReading, hourlyData, dailyStats }: SourceDetailsProps) {
  const getCurrentOutput = () => {
    switch (selectedSource) {
      case 'solar': return currentReading.solar;
      case 'wind': return currentReading.wind;
      case 'battery': return Math.abs(currentReading.battery);
      case 'total': return currentReading.solar + currentReading.wind + Math.max(0, currentReading.battery);
      default: return 0;
    }
  };

  const getTodayProduction = () => {
    if (!hourlyData.length) return 0;
    
    return hourlyData.reduce((sum, reading) => {
      switch (selectedSource) {
        case 'solar': return sum + reading.solar;
        case 'wind': return sum + reading.wind;
        case 'battery': return sum + Math.max(0, reading.battery);
        case 'total': return sum + reading.solar + reading.wind + Math.max(0, reading.battery);
        default: return sum;
      }
    }, 0);
  };

  const getEfficiency = () => {
    const maxCapacity = {
      solar: 150,
      wind: 120,
      battery: 50,
      total: 200
    };
    
    const current = getCurrentOutput();
    const max = maxCapacity[selectedSource] || 200;
    return Math.round((current / max) * 100);
  };

  const getSourceSpecificInfo = () => {
    switch (selectedSource) {
      case 'solar':
        return {
          title: 'Solar Energy System',
          icon: '☀️',
          color: 'amber',
          facts: [
            { label: 'Panel Capacity', value: '150 kW' },
            { label: 'Panel Type', value: 'Monocrystalline' },
            { label: 'Installed', value: '2023' },
            { label: 'Efficiency Rating', value: '22.1%' }
          ],
          insights: [
            'Peak production typically occurs at 12:00 PM',
            'Weather conditions affect output by 20-40%',
            'Optimal temperature range: 15-25°C',
            'Expected 25-year lifespan with 80% capacity retention'
          ]
        };
        
      case 'wind':
        return {
          title: 'Wind Energy System',
          icon: '💨',
          color: 'blue',
          facts: [
            { label: 'Turbine Capacity', value: '120 kW' },
            { label: 'Turbine Type', value: 'Horizontal Axis' },
            { label: 'Hub Height', value: '80m' },
            { label: 'Cut-in Speed', value: '3 m/s' }
          ],
          insights: [
            'Optimal wind speeds: 12-25 m/s',
            'Variable output based on wind patterns',
            'Automatic shutdown at speeds >25 m/s for safety',
            'Most productive during autumn and winter months'
          ]
        };
        
      case 'battery':
        return {
          title: 'Battery Storage System',
          icon: '🔋',
          color: 'emerald',
          facts: [
            { label: 'Capacity', value: '200 kWh' },
            { label: 'Technology', value: 'Lithium-ion' },
            { label: 'Max Discharge', value: '50 kW' },
            { label: 'Cycle Life', value: '6,000 cycles' }
          ],
          insights: [
            currentReading.battery < 0 ? 'Currently charging from excess production' : 'Currently discharging to meet demand',
            'Stores excess energy during peak production',
            'Provides backup power during low production',
            'Optimizes grid integration and reduces costs'
          ]
        };
        
      case 'total':
        return {
          title: 'Total Energy System',
          icon: '⚡',
          color: 'indigo',
          facts: [
            { label: 'Combined Capacity', value: '320 kW' },
            { label: 'Energy Sources', value: '3 Active' },
            { label: 'Grid Connection', value: 'Synchronized' },
            { label: 'Annual Target', value: '450 MWh' }
          ],
          insights: [
            'Hybrid system optimizes renewable energy capture',
            'Smart grid integration balances supply and demand',
            'Battery storage increases system efficiency by 15%',
            'Reduces carbon footprint by ~300 tons CO₂/year'
          ]
        };
        
      default:
        return null;
    }
  };

  const sourceInfo = getSourceSpecificInfo();
  if (!sourceInfo) return null;

  const currentOutput = getCurrentOutput();
  const todayProduction = getTodayProduction();
  const efficiency = getEfficiency();

  const getContainerClasses = () => {
    const baseClasses = "rounded-lg p-6 shadow-sm";
    switch (sourceInfo.color) {
      case 'amber':
        return `${baseClasses} bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700`;
      case 'blue':
        return `${baseClasses} bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700`;
      case 'emerald':
        return `${baseClasses} bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700`;
      case 'indigo':
        return `${baseClasses} bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-700`;
      default:
        return `${baseClasses} bg-white dark:bg-gray-800 border border-border`;
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div className="flex items-center mb-6">
        <div className="text-3xl mr-3">{sourceInfo.icon}</div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{sourceInfo.title}</h3>
          <p className="text-sm text-muted-foreground">Detailed analysis and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Current Output</div>
            <div className="text-lg font-bold text-primary">
              {formatPower(currentOutput)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Today&apos;s Production</div>
            <div className="text-lg font-bold text-primary">
              {formatEnergy(todayProduction)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Efficiency</div>
            <div className="text-lg font-bold text-primary">
              {efficiency}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-3">Technical Specifications</h4>
          <div className="space-y-2">
            {sourceInfo.facts.map((fact, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{fact.label}</span>
                <span className="text-sm font-medium text-foreground">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-3">Key Insights</h4>
          <div className="space-y-2">
            {sourceInfo.insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm text-muted-foreground">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}