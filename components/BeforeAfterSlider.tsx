"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  const startDrag = useCallback(
    (clientX: number) => {
      setIsDragging(true);
      updatePosition(clientX);
    },
    [updatePosition],
  );

  const endDrag = useCallback(() => setIsDragging(false), []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video overflow-hidden bg-evolucent-sand select-none touch-none",
        isDragging && "cursor-col-resize",
        className,
      )}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        startDrag(e.clientX);
        containerRef.current?.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setPosition((p) => Math.max(0, p - 2));
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setPosition((p) => Math.min(100, p + 2));
        }
      }}
      aria-label="Compare before and after project photos. Drag or use arrow keys."
      tabIndex={0}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external URLs + onError fallback */}
      <img
        src={afterSrc}
        alt={afterAlt}
        draggable={false}
        className="absolute inset-0 size-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        draggable={false}
        className="absolute inset-0 size-full object-cover grayscale-[30%]"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute top-1/2 z-20 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-card text-sm font-bold text-civic-green shadow-lg"
        style={{ left: `${position}%` }}
        aria-hidden
      >
        ↔
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-evolucent-black/75 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
        Before
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-civic-green px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
        After
      </div>

      <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-evolucent-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/90">
        Drag to compare
      </p>
    </div>
  );
}
