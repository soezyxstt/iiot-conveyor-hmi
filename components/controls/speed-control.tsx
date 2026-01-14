'use client';

import React from 'react';
import { useSystemStore } from '@/store/system-store';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useMQTT } from '@/hooks/use-mqtt';
import { MQTT_TOPICS } from '@/lib/mqtt/topics';

interface SpeedControlProps {
  is_enabled?: boolean;
}

export function SpeedControl({ is_enabled = true }: SpeedControlProps) {
  const speed_level = useSystemStore((s) => s.speed_level);
  const set_speed_level = useSystemStore((s) => s.set_speed_level);
  const mode = useSystemStore((s) => s.mode);
  const { publish } = useMQTT();

  // Logic Gabungan: 
  // 1. Parent bolehin (Power Ada) 
  // 2. Mode harus MANUAL
  const really_enabled = is_enabled && mode === 'manual';

  return (
    <div className={`space-y-4 ${!really_enabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Speed Level Display */}
      <div className="flex items-baseline gap-2">
        <Label className="text-sm font-medium">Speed Level:</Label>
        <span className="text-sm font-bold text-blue-600">{speed_level}</span>
      </div>

      {/* Slider */}
      <div className="relative pt-2">
        <Slider
          value={[speed_level]}
          onValueChange={(value) => {
            set_speed_level(value[0]);
            // Send command to MQTT
            // Send command to MQTT
            // TODO: Speed topic not found in new structure. Re-enable when confirmed.
            // publish(MQTT_TOPICS.STEPPER_SPEED, { value: value[0] });
          }}
          min={0}
          max={4}
          step={1}
          disabled={!really_enabled}
          className="w-full cursor-pointer"
        />

        {/* Labels */}
        <div className="flex justify-between mt-2 px-0.5">
          {[0, 1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={`text-xs font-medium ${step === speed_level ? 'text-blue-600' : 'text-gray-500'}`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}