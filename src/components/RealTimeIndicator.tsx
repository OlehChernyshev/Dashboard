'use client';

import { useState, useEffect } from 'react';

export default function RealTimeIndicator() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUpdateTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 5) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg border border-border p-3 shadow-lg z-50">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            {isOnline ? 'Live Data' : 'Offline'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatUpdateTime(lastUpdate)}
          </span>
        </div>
      </div>
    </div>
  );
}