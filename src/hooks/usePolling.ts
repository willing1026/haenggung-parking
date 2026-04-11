"use client";

import { useEffect, useRef } from "react";
import { useParkingStore } from "@/store/parkingStore";

const POLL_INTERVAL = 30_000;

export function usePolling() {
  const fetchLots = useParkingStore((s) => s.fetchLots);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchLots();

    const start = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchLots, POLL_INTERVAL);
      }
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchLots();
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchLots]);
}
