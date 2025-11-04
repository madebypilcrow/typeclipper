// src/components/GlyphTile.tsx
import React, { useMemo, useRef, useState } from "react";
import type { Glyph } from "@/types/glyph";
import { LONG_PRESS_MS } from "@/utils/constants"; // define as 450 in constants

type Props = {
  glyph: Glyph;
  onCopy: (g: Glyph) => void;
  onShowDetails: (g: Glyph) => void;   // parent chooses sheet vs modal
  onToggleFavorite: (g: Glyph) => void;
  longPressMs?: number;                 // optional override
  className?: string;
};

function useIsTouch() {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)")?.matches ||
        "ontouchstart" in window),
    []
  );
}

export default function GlyphTile({
  glyph,
  onCopy,
  onShowDetails,
  onToggleFavorite,
  longPressMs = LONG_PRESS_MS,
  className,
}: Props) {
  const isTouch = useIsTouch();
  const timerRef = useRef<number | null>(null);
  const firedLongPressRef = useRef(false);
  const [pressing, setPressing] = useState(false);

  const cancelTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startLongPressTimer = () => {
    if (!isTouch) return;
    firedLongPressRef.current = false;
    timerRef.current = window.setTimeout(() => {
      firedLongPressRef.current = true;
      onToggleFavorite(glyph);
    }, longPressMs);
  };

  const handlePointerDown = () => {
    setPressing(true);
    startLongPressTimer();
  };

  const handlePointerUp = () => {
    setPressing(false);
    cancelTimer();
  };

  const handleActivate = () => {
    if (firedLongPressRef.current) {
      firedLongPressRef.current = false;
      return;
    }
    onCopy(glyph);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={className}
      aria-label={`copy ${glyph.name}`}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={cancelTimer}
      onPointerLeave={handlePointerUp}
      data-category={glyph.category}
      data-pressing={pressing || undefined}
    >
      {/* favorites — desktop only */}
      {!isTouch && (
        <button
          type="button"
          aria-label="add to favorites"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(glyph);
          }}
        >
          ★
        </button>
      )}

      {/* details */}
      <button
        type="button"
        aria-label="details"
        onClick={(e) => {
          e.stopPropagation();
          onShowDetails(glyph);
        }}
      >
        ⋮
      </button>

      {/* glyph */}
      <span aria-hidden="true">{glyph.symbol}</span>

      {/* name */}
      <span>{glyph.name}</span>
    </div>
  );
}
