'use client';

import { EnergySource } from '@/types/energy';
import { getEnergySourceColor } from '@/lib/utils';

interface SourceToggleProps {
  selectedSource: EnergySource;
  onSourceChange: (source: EnergySource) => void;
}

const sources: { key: EnergySource; label: string; icon: string }[] = [
  { key: 'total', label: 'Total', icon: '⚡' },
  { key: 'solar', label: 'Solar', icon: '☀️' },
  { key: 'wind', label: 'Wind', icon: '💨' },
  { key: 'battery', label: 'Battery', icon: '🔋' },
];

export default function SourceToggle({ selectedSource, onSourceChange }: SourceToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Energy Source</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {sources.map((source) => {
          const isSelected = selectedSource === source.key;
          const color = getEnergySourceColor(source.key);
          
          return (
            <button
              key={source.key}
              onClick={() => onSourceChange(source.key)}
              className={`
                flex items-center justify-start p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
                ${isSelected 
                  ? 'border-current shadow-sm' 
                  : 'border-border hover:border-gray-300'
                }
              `}
              style={{
                color: isSelected ? color : undefined,
                backgroundColor: isSelected ? `${color}10` : undefined
              }}
            >
              <span className="text-xl mr-2">{source.icon}</span>
              <span className="text-sm font-medium">{source.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}