'use client';

import React from 'react';
import { StatusIndicator } from '@/components/common/status-indicator';

// Kita terima data dari parent (MonitoringTab)
export function RelayStatus({ data }: { data: any }) {
  
  // Kita buat mapping manual agar data boolean dari Database
  // bisa diloop seperti struktur array yang lama.
  const relayList = [
    // Linear Actuators
    { name: 'LA1 Forward', active: data.la1Forward },
    { name: 'LA1 Backward', active: data.la1Backward },
    { name: 'LA2 Forward', active: data.la2Forward },
    { name: 'LA2 Backward', active: data.la2Backward },
    
    // Steppers
    { name: 'Stepper 1 Relay', active: data.stepper1Relay },
    { name: 'Stepper 2 Relay', active: data.stepper2Relay },
    
    // Proximity/Sensor Relays
    { name: 'IR Relay', active: data.irRelay },
    { name: 'Inductive Relay', active: data.inductiveRelay },
    { name: 'Capacitive Relay', active: data.capacitiveRelay },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {relayList.map((relay, index) => (
        <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          
          {/* Indikator Lampu */}
          <StatusIndicator
            status={relay.active ? 'active' : 'inactive'}
            size="small"
            animated={relay.active} // Kedip kalau aktif
            title={relay.name}
          />

          <div className="flex flex-col">
            {/* Nama Relay */}
            <div className="font-semibold text-sm">{relay.name}</div>
            
            {/* Status Text (ON/OFF) */}
            <div className={`text-xs font-mono ${relay.active ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
              State: {relay.active ? 'ON' : 'OFF'}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}