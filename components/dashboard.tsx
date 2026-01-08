'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import Store & Actions untuk Cek Power Global
import { getLatestData } from '@/app/actions';
import { useSystemStore } from '@/store/system-store';

// Import Semua Tab (LENGKAP)
import { MonitoringTab } from './tabs/monitoring-tab';
import { ControlsTab } from './tabs/controls-tab';
import { DiagnosticsTab } from './tabs/diagnostics-tab'; // ✅ Diagnostics Ada
import { DatabaseTab } from './tabs/database-tab';       // ✅ Database Ada

// Tipe Tab Lengkap
type TabType = 'monitoring' | 'controls' | 'diagnostics' | 'database';

export function Dashboard() {
  const [active_tab, set_active_tab] = useState<TabType>('monitoring');

  // --- GLOBAL POWER CHECKER (Fix Masalah "No Power" di Awal) ---
  const set_electricity_status = useSystemStore((s) => s.set_electricity_status);

  useEffect(() => {
    const checkGlobalPower = async () => {
      try {
        const data = await getLatestData();
        if (data) {
          // Update Store Global detik itu juga
          set_electricity_status(data.isPowerLive ? 'live' : 'not-live');
        }
      } catch (e) {
        console.error("Global power check failed:", e);
      }
    };

    // Cek langsung saat pertama kali buka web
    checkGlobalPower();
    
    // Cek rutin tiap 1 detik (biar sinkron terus)
    const interval = setInterval(checkGlobalPower, 1000);
    return () => clearInterval(interval);
  }, [set_electricity_status]);
  // -----------------------------------------------------------

  return (
    <div className="container mx-auto p-6">
      <Tabs
        value={active_tab}
        onValueChange={(value) => set_active_tab(value as TabType)}
        className="w-full"
      >
        {/* Navigation Tabs (Grid 4 Kolom) */}
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="database">Database & Trends</TabsTrigger>
        </TabsList>

        {/* Content Area */}
        <TabsContent value="monitoring" className="space-y-6">
          <MonitoringTab />
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <ControlsTab />
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          <DiagnosticsTab />
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <DatabaseTab />
        </TabsContent>

      </Tabs>
    </div>
  );
}