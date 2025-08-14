'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EnergyReading, EnergySource } from '@/types/energy';
import { formatTime, formatPower, getEnergySourceColor, calculateTotal } from '@/lib/utils';

interface EnergyChartProps {
  data: EnergyReading[];
  selectedSource: EnergySource;
}

export default function EnergyChart({ data, selectedSource }: EnergyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Energy Chart</h3>
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </div>
    );
  }

  const chartData = data.map(reading => ({
    time: formatTime(reading.timestamp),
    solar: reading.solar,
    wind: reading.wind,
    battery: Math.max(0, reading.battery),
    total: calculateTotal(reading.solar, reading.wind, reading.battery)
  }));

  const getDataKey = () => {
    switch (selectedSource) {
      case 'solar': return 'solar';
      case 'wind': return 'wind';
      case 'battery': return 'battery';
      case 'total': return 'total';
      default: return 'total';
    }
  };

  const getChartTitle = () => {
    switch (selectedSource) {
      case 'solar': return 'Solar Power Output - Daylight Curve';
      case 'wind': return 'Wind Power Output - Variable Generation';
      case 'battery': return 'Battery Output - Storage Discharge';
      case 'total': return 'Total Power Output - Combined System';
      default: return 'Total Power Output';
    }
  };

  const getChartDescription = () => {
    switch (selectedSource) {
      case 'solar': return 'Shows peak production during midday hours (6 AM - 6 PM)';
      case 'wind': return 'Displays variable wind generation patterns throughout the day';
      case 'battery': return 'Tracks energy discharge from battery storage system';
      case 'total': return 'Combined output from all renewable energy sources';
      default: return 'Last 24 hours';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm animate-in fade-in duration-500 h-full flex flex-col">
      <div className="mb-3 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{getChartTitle()}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">{getChartDescription()}</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `${value}kW`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [formatPower(value), getChartTitle()]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey={getDataKey()}
              stroke={getEnergySourceColor(selectedSource)}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: getEnergySourceColor(selectedSource), strokeWidth: 3, fill: 'white' }}
              strokeDasharray={selectedSource === 'battery' ? '5 5' : undefined}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}