'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { EnergyReading } from '@/types/energy';
import { formatTime, formatPower } from '@/lib/utils';

interface MultiSourceChartProps {
  data: EnergyReading[];
}

export default function MultiSourceChart({ data }: MultiSourceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Energy Production Overview</h3>
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </div>
    );
  }

  const chartData = data.map(reading => ({
    time: formatTime(reading.timestamp),
    fullTime: reading.timestamp,
    solar: reading.solar,
    wind: reading.wind,
    battery: Math.max(0, reading.battery),
    total: reading.solar + reading.wind + Math.max(0, reading.battery)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatPower(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm h-full flex flex-col">
      <div className="mb-3 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Energy Production Overview</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">All energy sources - Last 24 hours</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="solar"
              stackId="1"
              stroke="#f59e0b"
              fill="url(#colorSolar)"
              strokeWidth={2}
              name="Solar"
            />
            <Area
              type="monotone"
              dataKey="wind"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#colorWind)"
              strokeWidth={2}
              name="Wind"
            />
            <Area
              type="monotone"
              dataKey="battery"
              stackId="1"
              stroke="#10b981"
              fill="url(#colorBattery)"
              strokeWidth={2}
              name="Battery"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-shrink-0 mt-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Solar</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Wind</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Battery</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Online</span>
        </div>
      </div>
    </div>
  );
}