"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ParkingLot } from "@/types/parking";
import { useParkingStore } from "@/store/parkingStore";
import { STATUS_CONFIG } from "@/lib/status";
import { OccupancyBar } from "./OccupancyBar";
import { StatusBadge } from "./StatusBadge";
import { NaviButton } from "./NaviButton";

interface Props {
  lot: ParkingLot;
}

export function ParkingCard({ lot }: Props) {
  const expandedCardId = useParkingStore((s) => s.expandedCardId);
  const toggleCard = useParkingStore((s) => s.toggleCard);
  const isExpanded = expandedCardId === lot.id;
  const isFull = lot.status === "full";
  const config = STATUS_CONFIG[lot.status];

  return (
    <button
      onClick={() => toggleCard(lot.id)}
      className={`w-full text-left rounded-xl bg-bg-card border border-border/50
        active:bg-bg-card-hover transition-all overflow-hidden
        ${isFull ? "opacity-40" : config.cardGlow}`}
    >
      <div className="flex">
        {/* 좌측 컬러 바 */}
        <div className={`w-1 shrink-0 rounded-l-xl ${config.barColor}`} />

        <div className="flex-1 px-4 py-3">
          {/* 이름 + 배지 */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-text-primary truncate pr-2">
              {lot.name}
            </h3>
            <StatusBadge status={lot.status} />
          </div>

          {/* 점유 바 */}
          <OccupancyBar available={lot.available} total={lot.total} status={lot.status} />

          {/* 확장 영역 */}
          <div className={`grid transition-all duration-300 ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="pt-3 mt-3 border-t border-border/50 space-y-2 text-sm">
                {lot.address && <AddressRow address={lot.address} />}
                {lot.feeBase && <DetailRow label="기본요금" value={lot.feeBase} />}
                {lot.feeAdditional && <DetailRow label="추가요금" value={lot.feeAdditional} />}
                {lot.feeMaxDaily && <DetailRow label="일최대" value={lot.feeMaxDaily} />}
                {lot.hours && <DetailRow label="운영시간" value={lot.hours} />}
                <DetailRow label="주차중" value={`${lot.occupied}대`} />

                {/* 액션 버튼 */}
                {lot.lat && lot.lng && (
                  <div className="pt-2">
                    <NaviButton lat={lot.lat} lng={lot.lng} name={lot.name} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary">{value}</span>
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
    <div className="flex items-center justify-between gap-2">
      <span className="text-text-secondary shrink-0">주소</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="truncate text-text-primary">{address}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={handleCopy}
          onKeyDown={(e) => { if (e.key === "Enter") handleCopy(e as unknown as React.MouseEvent); }}
          className="shrink-0 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs
            bg-border text-text-secondary hover:bg-bg-card-hover transition-colors"
        >
          {copied ? <><Check size={12} /> 복사됨</> : <><Copy size={12} /> 복사</>}
        </span>
      </div>
    </div>
  );
}
