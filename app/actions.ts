'use server';

import { db } from '@/db';
import { machineLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';

// 1. Fungsi Ambil Data (Yang sudah ada sebelumnya)
export async function getLatestData() {
  try {
    const data = await db
      .select()
      .from(machineLogs)
      .orderBy(desc(machineLogs.createdAt))
      .limit(1);
    
    return data[0] || null;
  } catch (error) {
    console.error('Failed to fetch latest data:', error);
    return null;
  }
}

// 2. Fungsi History (Untuk Chart nanti)
export async function getHistoryData(limit = 50) {
  try {
    const data = await db
      .select()
      .from(machineLogs)
      .orderBy(desc(machineLogs.createdAt))
      .limit(limit);
    
    return data.reverse();
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}

// 3. Fungsi Kirim Perintah (INI YANG HILANG DAN BIKIN ERROR)
export async function sendCommand(updates: any) {
  try {
    // Ambil state terakhir mesin biar data sensor lain gak hilang
    const latest = await getLatestData();
    
    if (!latest) return { success: false, message: "No data found" };

    // Insert baris baru: Data Lama + Update Baru dari Tombol
    await db.insert(machineLogs).values({
      ...latest,      // Copy semua field lama
      ...updates,     // Timpa field yang diubah (misal: la1Forward: true)
      id: undefined,  // Biar database generate ID baru
      createdAt: undefined // Biar database generate waktu baru
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send command:", error);
    return { success: false };
  }
}

// ... imports yang sudah ada
import { and, gte, lte } from 'drizzle-orm'; // Pastikan import ini ada

// ... fungsi getLatestData & sendCommand ...

// FUNGSI BARU: Ambil data berdasarkan rentang waktu
export async function getFilteredLogs(startDate: Date, endDate: Date) {
  try {
    const data = await db
      .select()
      .from(machineLogs)
      .where(
        and(
          gte(machineLogs.createdAt, startDate), // Greater Than or Equal (>= Start)
          lte(machineLogs.createdAt, endDate)    // Less Than or Equal (<= End)
        )
      )
      .orderBy(desc(machineLogs.createdAt)); // Urutkan dari yang terbaru
    
    // Kita reverse biar di grafik urut dari Kiri (Lama) ke Kanan (Baru)
    return data.reverse();
  } catch (error) {
    console.error("Gagal filter data:", error);
    return [];
  }
}