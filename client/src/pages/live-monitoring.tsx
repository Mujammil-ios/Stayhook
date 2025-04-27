import React from 'react';
import { RefinedRoomMonitoring } from '@/features/rooms/components/RefinedRoomMonitoring';

const LiveMonitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Live Room Monitoring</h1>
      </div>
      
      <RefinedRoomMonitoring />
    </div>
  );
};

export default LiveMonitoring;