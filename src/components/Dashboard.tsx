'use client';

import { useState, useEffect } from 'react';
import { EnergySource, EnergyReading, DailyStats } from '@/types/energy';
import { energySimulator } from '@/lib/data';
import { formatPower, formatEnergy, calculateTotal } from '@/lib/utils';
import KPICard from './KPICard';
import EnergyChart from './EnergyChart';
import SourceToggle from './SourceToggle';
import ThemeToggle from './ThemeToggle';
import EnergyFlow from './EnergyFlow';
import MultiSourceChart from './MultiSourceChart';
import SourceDetails from './SourceDetails';

export default function Dashboard() {
  const [selectedSource, setSelectedSource] = useState<EnergySource>('total');
  const [currentReading, setCurrentReading] = useState(() => ({
    timestamp: new Date().toISOString(),
    solar: 0,
    wind: 0,
    battery: 0
  }));
  const [hourlyData, setHourlyData] = useState<EnergyReading[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    date: new Date().toISOString().split('T')[0],
    totalProduction: 0,
    peakOutput: 0,
    efficiency: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentReading(energySimulator.generateCurrentReading());
    setHourlyData(energySimulator.generateHourlyData());
    setDailyStats(energySimulator.generateDailyStats());
    setIsLoaded(true);

    const interval = setInterval(() => {
      setCurrentReading(energySimulator.generateCurrentReading());
      setHourlyData(energySimulator.generateHourlyData());
      setDailyStats(energySimulator.generateDailyStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTotal = calculateTotal(
    currentReading.solar, 
    currentReading.wind, 
    currentReading.battery
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-muted-foreground">Loading energy data...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Energy Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Real-time renewable energy monitoring
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div 
            className="mb-4 flex-shrink-0" 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem'
            }}
          >
            <KPICard
              title="Current Output"
              value={formatPower(currentTotal)}
              icon={<span>⚡</span>}
              trend={{ value: 5.2, isPositive: true }}
            />
            <KPICard
              title="Today's Production"
              value={formatEnergy(dailyStats.totalProduction)}
              icon={<span>📊</span>}
              trend={{ value: 12.1, isPositive: true }}
            />
            <KPICard
              title="Peak Output"
              value={formatPower(dailyStats.peakOutput)}
              icon={<span>🎯</span>}
            />
            <KPICard
              title="Efficiency"
              value={dailyStats.efficiency.toString()}
              unit="%"
              icon={<span>⭐</span>}
              trend={{ value: 3.8, isPositive: false }}
            />
          </div>

          <div 
            className="flex-1 min-h-0 gap-4"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              minHeight: 0,
              gap: '1rem'
            }}
          >
            <div className="flex flex-col space-y-4 min-h-0" style={{ minHeight: 0 }}>
              <div className="flex-shrink-0">
                <EnergyFlow currentReading={currentReading} />
              </div>

              <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="h-1/2 min-h-0">
                  <MultiSourceChart data={hourlyData} />
                </div>

                <div className="h-1/2 min-h-0">
                  <EnergyChart
                    data={hourlyData}
                    selectedSource={selectedSource}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 min-h-0" style={{ minHeight: 0 }}>
              <div className="flex-shrink-0">
                <SourceToggle
                  selectedSource={selectedSource}
                  onSourceChange={setSelectedSource}
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                <SourceDetails 
                  selectedSource={selectedSource}
                  currentReading={currentReading}
                  hourlyData={hourlyData}
                  dailyStats={dailyStats}
                />

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    System Performance
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">☀️</div>
                        <div>
                          <div className="text-xs font-medium text-foreground">Solar</div>
                          <div className="text-xs text-muted-foreground">
                            {currentReading.solar > 0 ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {formatPower(currentReading.solar)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">💨</div>
                        <div>
                          <div className="text-xs font-medium text-foreground">Wind</div>
                          <div className="text-xs text-muted-foreground">
                            {currentReading.wind > 0 ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {formatPower(currentReading.wind)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">🔋</div>
                        <div>
                          <div className="text-xs font-medium text-foreground">Battery</div>
                          <div className="text-xs text-muted-foreground">
                            {currentReading.battery < 0 ? 'Charging' : 'Discharging'}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {formatPower(Math.abs(currentReading.battery))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">⚡</div>
                        <div>
                          <div className="text-xs font-medium text-foreground">Total</div>
                          <div className="text-xs text-muted-foreground">
                            {currentTotal > 0 ? 'Producing' : 'Standby'}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {formatPower(currentTotal)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">System Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Grid Connected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Monitoring Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-center text-xs text-muted-foreground">
                <p>Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}