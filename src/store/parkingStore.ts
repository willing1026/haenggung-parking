"use client";

import { create } from "zustand";
import type { ParkingLot, ParkingResponse, SortBy } from "@/types/parking";

interface ParkingState {
  lots: ParkingLot[];
  timestamp: string | null;
  isLoading: boolean;
  error: string | null;
  sortBy: SortBy;
  userLocation: { lat: number; lng: number } | null;
  expandedCardId: string | null;
  fetchLots: () => Promise<void>;
  setSortBy: (sort: SortBy) => void;
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  toggleCard: (id: string) => void;
}

export const useParkingStore = create<ParkingState>((set, get) => ({
  lots: [],
  timestamp: null,
  isLoading: false,
  error: null,
  sortBy: "availability",
  userLocation: null,
  expandedCardId: null,

  fetchLots: async () => {
    set({ isLoading: get().lots.length === 0 });
    try {
      const res = await fetch("/api/parking");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: ParkingResponse = await res.json();
      set({ lots: data.lots, timestamp: data.timestamp, error: null, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  setSortBy: (sortBy) => set({ sortBy }),
  setUserLocation: (userLocation) => set({ userLocation }),
  toggleCard: (id) =>
    set((s) => ({ expandedCardId: s.expandedCardId === id ? null : id })),
}));
