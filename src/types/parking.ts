export type ParkingStatus = "available" | "normal" | "congested" | "full";

export interface ParkingLot {
  id: string;
  name: string;
  total: number;
  occupied: number;
  available: number;
  status: ParkingStatus;
  address: string | null;
  lat: number | null;
  lng: number | null;
  feeInfo: string | null;
  feeBase: string | null;
  feeAdditional: string | null;
  feeMaxDaily: string | null;
  hours: string | null;
  updatedAt: string;
}

export interface ParkingResponse {
  timestamp: string;
  lots: ParkingLot[];
}

export type SortBy = "availability" | "name" | "distance";
