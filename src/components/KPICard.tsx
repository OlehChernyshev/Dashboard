interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export default function KPICard({ title, value, unit, trend, icon }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center text-xs ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
          {unit && (
            <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
}