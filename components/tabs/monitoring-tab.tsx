'use client';

import { useState, useEffect } from "react";
import { getLatestData } from "@/app/actions";
import { DigitalTwin2D } from '../monitoring/digital-twin2d';
import { RelayStatus } from '@/components/monitoring/relay-status';
import { Card } from '@/components/ui/card';

// --- TAMBAHAN BARU ---
import { conveyorLogs } from '@/db/schema'; // Pastikan path ke schema.ts benar
import { type InferSelectModel } from 'drizzle-orm';

// Ini akan otomatis mengambil tipe data sesuai kolom database kamu!
// Tidak perlu ngetik manual satu-satu.
type MachineData = InferSelectModel<typeof conveyorLogs>;
// ---------------------

export function MonitoringTab() {
  // State bisa null (saat loading) atau berisi data
  const [data, setData] = useState<MachineData | null>(null); 
  const [loading, setLoading] = useState(true);

  // --- LOGIKA REALTIME ---
  useEffect(() => {
    const fetchData = async () => {
      const result = await getLatestData();
      if (result) {
        setData(result);
        setLoading(false);
      }
    };

    fetchData(); // Jalan pertama kali
    const interval = setInterval(fetchData, 1000); // Update tiap 1 detik

    return () => clearInterval(interval);
  }, []);

  // Tampilan Loading sementara
  if (loading || !data) {
    return <div className="p-10 text-center animate-pulse">Menghubungkan ke Mesin...</div>;
  }

  return (
    <div className="space-y-6">
      {/* PENTING: Kita kirim 'data' ke komponen anak sebagai PROPS.
         Pastikan komponen DigitalTwin2D dan RelayStatus siap menerima props ini.
      */}

      {/* 2D Digital Twin */}
      <Card className="p-6">
        <DigitalTwin2D data={data} />
      </Card>

      {/* Relay Status */}
      <Card className="p-6">
        <RelayStatus data={data} />
      </Card>
    </div>
  );
}

