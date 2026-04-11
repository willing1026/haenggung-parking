"use client";

import { Header } from "@/components/Header";
import { SummaryBar } from "@/components/SummaryBar";
import { SortSelector } from "@/components/SortSelector";
import { ParkingCardList } from "@/components/ParkingCardList";
import { usePolling } from "@/hooks/usePolling";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Home() {
  usePolling();
  useGeolocation();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-3 pb-8">
      <Header />
      <SummaryBar />
      <SortSelector />
      <ParkingCardList />
    </main>
  );
}
