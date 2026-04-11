"use client";

import { useEffect } from "react";
import { useParkingStore } from "@/store/parkingStore";

export function useGeolocation() {
  const setUserLocation = useParkingStore((s) => s.setUserLocation);
  const sortBy = useParkingStore((s) => s.sortBy);

  useEffect(() => {
    if (sortBy !== "distance") return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 5000 },
    );
  }, [sortBy, setUserLocation]);
}
