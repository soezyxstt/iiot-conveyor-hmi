'use client';

import React from 'react';
import { StatusIndicator } from '@/components/common/status-indicator';
import { useActuatorStore } from '@/store/actuator-store';
import { useConveyorStore } from '@/store/conveyor-store';
import { useSensorStore } from '@/store/sensor-store';

// Kita terima data dari parent (MonitoringTab)
export function RelayStatus({ data }: { data: any }) {

  const actuator_store = useActuatorStore();
  const conveyor_store = useConveyorStore();
  const sensor_store = useSensorStore();

  // Create relay list merging Real-time Store (Priority) with DB Data (Fallback)
  const relayList = [
    // Actuators (DL/LD)
    { name: 'DL Push', active: actuator_store.dl_actuator.push ?? data.dlPush },
    { name: 'DL Pull', active: actuator_store.dl_actuator.pull ?? data.dlPull },
    { name: 'LD Push', active: actuator_store.ld_actuator.push ?? data.ldPush },
    { name: 'LD Pull', active: actuator_store.ld_actuator.pull ?? data.ldPull },
    
    // Steppers
    { name: 'Stepper Inner', active: conveyor_store.inner_conveyor.is_running ?? data.stepperInnerRotate },
    { name: 'Stepper Outer', active: conveyor_store.outer_conveyor.is_running ?? data.stepperOuterRotate },
    
    // Sensors
    { name: 'IR Sensor', active: sensor_store.ir_sensor.state ?? data.irSensor },
    { name: 'Inductive', active: sensor_store.inductive_sensor.state ?? data.inductiveSensor },
    { name: 'Capacitive', active: sensor_store.capacitive_sensor.state ?? data.capacitiveSensor },
    { name: 'Pos Inner', active: sensor_store.position_inner_sensor.state ?? data.positionInnerSensor },
    { name: 'Pos Outer', active: sensor_store.position_outer_sensor.state ?? data.positionOuterSensor },
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