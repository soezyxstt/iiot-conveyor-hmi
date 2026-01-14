'use client';

import { useEffect } from 'react';
import { getLatestData } from '@/app/actions';
import { useSystemStore, type SystemMode } from '@/store/system-store';

export function ModeSelector() {
  // Ambil state satu per satu (Selector Pattern) biar AMAN dari error
  const mode = useSystemStore((s) => s.mode);
  const set_mode = useSystemStore((s) => s.set_mode);
  const set_electricity_status = useSystemStore((s) => s.set_electricity_status);

  // --- LOGIKA PENYADAP DATABASE ---
  // --- LOGIKA PENYADAP DATABASE DIHAPUS ---
  // Power status handled by MQTT or defaults.

  return (
    <div className="flex gap-4">
      {['manual', 'automatic', 'off'].map((m) => (
        <button
          key={m}
          onClick={() => set_mode(m as SystemMode)}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm
            ${mode === m
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}
          `}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}