"use client";

import { useState } from "react";
import type { ParkingLot } from "@/types/parking";
import { useParkingStore } from "@/store/parkingStore";
import { CircularProgress } from "./CircularProgress";
import { StatusBadge } from "./StatusBadge";

interface Props {
  lot: ParkingLot;
}

export function ParkingCard({ lot }: Props) {
  const expandedCardId = useParkingStore((s) => s.expandedCardId);
  const toggleCard = useParkingStore((s) => s.toggleCard);
  const isExpanded = expandedCardId === lot.id;

  const occupancyPercent =
    lot.total > 0 ? Math.round((lot.occupied / lot.total) * 100) : 100;

  return (
    <button
      onClick={() => toggleCard(lot.id)}
      className="w-full rounded-lg bg-white p-4 shadow-sm text-left transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <CircularProgress percent={occupancyPercent} status={lot.status} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{lot.name}</span>
            <StatusBadge status={lot.status} />
          </div>
          <div className="mt-1 text-sm text-gray-500">
            잔여 <span className="font-semibold text-gray-900">{lot.available}</span>
            <span className="text-gray-400">/{lot.total}면</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-1.5 border-t pt-3 text-sm text-gray-600">
          {lot.address && <AddressRow address={lot.address} />}
          {lot.feeBase && <DetailRow label="기본요금" value={lot.feeBase} />}
          {lot.feeAdditional && <DetailRow label="추가요금" value={lot.feeAdditional} />}
          {lot.feeMaxDaily && <DetailRow label="일최대" value={lot.feeMaxDaily} />}
          {lot.feeInfo && <DetailRow label="요금안내" value={lot.feeInfo} />}
          {lot.hours && <DetailRow label="운영시간" value={lot.hours} />}
          <DetailRow label="주차중" value={`${lot.occupied}대`} />
          <DetailRow label="전체" value={`${lot.total}면`} />
        </div>
      )}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function AddressRow({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-gray-400 shrink-0">주소</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="truncate">{address}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={handleCopy}
          onKeyDown={(e) => { if (e.key === "Enter") handleCopy(e as unknown as React.MouseEvent); }}
          className="shrink-0 rounded px-1.5 py-0.5 text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          {copied ? "복사됨" : "복사"}
        </span>
      </div>
    </div>
  );
}
