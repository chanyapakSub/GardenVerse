"use client";

import { useEffect, useState } from "react";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  onValue,
} from "firebase/database";
import { rtdb } from "@/lib/firebase";

export interface SensorReading {
  device_id: string;
  temperature: number | null;
  humidity: number | null;
  lux: number | null;
  recorded_at: string; // ISO string
}

interface FirebaseReading {
  device_id?: string;
  temperature?: number;
  humidity?: number;
  lux?: number;
  timestamp?: number; // epoch ms
}

function toSensorReading(raw: FirebaseReading): SensorReading | null {
  if (!raw || !raw.device_id) return null;
  return {
    device_id: raw.device_id,
    temperature: raw.temperature ?? null,
    humidity: raw.humidity ?? null,
    lux: raw.lux ?? null,
    recorded_at: raw.timestamp
      ? new Date(raw.timestamp).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Subscribe Firebase RTDB /readings filtered by device_id — push ค่าใหม่ทันที
 */
export function useLatestReading(deviceId: string | null | undefined) {
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId) {
      setReading(null);
      setError(null);
      return;
    }

    setIsLoading(true);

    const readingsQuery = query(
      ref(rtdb, "/readings"),
      orderByChild("device_id"),
      equalTo(deviceId),
      limitToLast(1)
    );

    const unsubscribe = onValue(
      readingsQuery,
      (snapshot) => {
        let latest: SensorReading | null = null;
        snapshot.forEach((child) => {
          const r = toSensorReading(child.val() as FirebaseReading);
          if (
            r &&
            (!latest ||
              new Date(r.recorded_at) > new Date(latest.recorded_at))
          ) {
            latest = r;
          }
        });
        setReading(latest);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [deviceId]);

  return { reading, isLoading, error };
}
