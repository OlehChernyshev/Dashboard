'use client';

import { EnergyReading } from '@/types/energy';
import { formatPower } from '@/lib/utils';

interface EnergyFlowProps {
  currentReading: EnergyReading;
}

export default function EnergyFlow({ currentReading }: EnergyFlowProps) {
  const total = currentReading.solar + currentReading.wind + Math.max(0, currentReading.battery);
  const isCharging = currentReading.battery < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-3 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-3">Energy Flow</h3>
      
      <div className="flex items-center justify-between space-x-4">
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
              currentReading.solar > 0 
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 animate-pulse' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              ☀️
            </div>
            <div className="mt-1 text-center">
              <div className="text-xs font-medium text-amber-600">{formatPower(currentReading.solar)}</div>
              <div className="text-xs text-muted-foreground">Solar</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
              currentReading.wind > 0 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 animate-pulse' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              💨
            </div>
            <div className="mt-1 text-center">
              <div className="text-xs font-medium text-blue-600">{formatPower(currentReading.wind)}</div>
              <div className="text-xs text-muted-foreground">Wind</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
              Math.abs(currentReading.battery) > 0
                ? isCharging 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 animate-pulse'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              🔋
            </div>
            <div className="mt-1 text-center">
              <div className={`text-xs font-medium ${isCharging ? 'text-green-600' : 'text-orange-600'}`}>
                {formatPower(Math.abs(currentReading.battery))}
              </div>
              <div className="text-xs text-muted-foreground">
                {isCharging ? 'Charging' : 'Battery'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {(currentReading.solar > 0 || currentReading.wind > 0 || currentReading.battery > 0) && (
            <>
              <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent animate-pulse"></div>
              <div className="text-primary text-lg">→</div>
              <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent animate-pulse"></div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
            total > 0 
              ? 'bg-primary/10 text-primary animate-pulse border-2 border-primary/20' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
          }`}>
            ⚡
          </div>
          <div className="mt-1 text-center">
            <div className="text-sm font-bold text-primary">{formatPower(total)}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {total > 0 && (
            <>
              <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent animate-pulse"></div>
              <div className="text-primary text-lg">→</div>
              <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent animate-pulse"></div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
            total > 0 
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 animate-pulse' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
          }`}>
            🏭
          </div>
          <div className="mt-1 text-center">
            <div className="text-xs font-medium text-indigo-600">Grid</div>
            <div className="text-xs text-muted-foreground">Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
}