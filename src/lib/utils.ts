export function formatPower(power: number): string {
  if (power >= 1000) {
    return `${(power / 1000).toFixed(1)} MW`;
  }
  return `${power.toFixed(1)} kW`;
}

export function formatEnergy(energy: number): string {
  if (energy >= 1000) {
    return `${(energy / 1000).toFixed(1)} MWh`;
  }
  return `${energy.toFixed(1)} kWh`;
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

export function calculateTotal(solar: number, wind: number, battery: number): number {
  return solar + wind + Math.max(0, battery);
}

export function getEnergySourceColor(source: string): string {
  switch (source) {
    case 'solar':
      return '#f59e0b';
    case 'wind':
      return '#3b82f6';
    case 'battery':
      return '#10b981';
    case 'total':
      return '#6366f1';
    default:
      return '#64748b';
  }
}