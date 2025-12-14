import { useEffect, useRef, useState } from "react";
import type { Glyph } from "@/types/glyph";
import "@/styles/glyphTile.scss";

type Props = {
  glyph: Glyph;
  isFavorite?: boolean;
  onCopy: (g: Glyph) => void;
  onShowDetails: (g: Glyph) => void;
  onToggleFavorite: (g: Glyph) => void;
  className?: string;
};

const LONGPRESS_MS = 420;

const STAR_FILLED =
  "M480-272 312.5-171q-10.5 6.5-21.75 5.5T271-173q-8.5-6.5-13-16.5t-1.5-22L301-402 153-530q-9.5-8.5-12-19.25t1-20.75q3.5-10 11.75-17t20.75-8.5l195-17 76-179.5q5-11.5 14.5-17t20-5.5q10.5 0 20 5.5t14.5 17l76 179.5 195 17q12.5 1.5 20.75 8.5T818-570q3.5 10 1 20.75T807-530L659-402l44.5 190.5q3 12-1.5 22T689-173q-8.5 6.5-19.75 7.5T647.5-171L480-272Z";

const STAR_OUTLINE =
  "M350-281.5 480-360l130 79-34.5-148 115-99-151-13.5-59.5-140L420.5-542l-151 13 115 99.5-34.5 148Zm130 9.5L312.5-171q-10.5 6.5-21.75 5.5T271-173q-8.5-6.5-13-16.5t-1.5-22L301-402 153-530q-9.5-8.5-12-19.25t1-20.75q3.5-10 11.75-17t20.75-8.5l195-17 76-179.5q5-11.5 14.5-17t20-5.5q10.5 0 20 5.5t14.5 17l76 179.5 195 17q12.5 1.5 20.75 8.5T818-570q3.5 10 1 20.75T807-530L659-402l44.5 190.5q3 12-1.5 22T689-173q-8.5 6.5-19.75 7.5T647.5-171L480-272Zm0-199Z";

export default function GlyphTile({
  glyph,
  isFavorite = false,
  onCopy,
  onShowDetails,
  onToggleFavorite,
  className = "",
}: Props) {
  const timerRef = useRef<number | null>(null);
  const longPressFiredRef = useRef(false);
  const startXYRef = useRef<{ x: number; y: number } | null>(null);

  // Used only to avoid long-press on hover devices (desktop/laptop)
  const [hoverCapable, setHoverCapable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(Boolean(mq?.matches));
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only long-press on touch (or pen). Avoid desktop mouse.
    if (hoverCapable || e.pointerType === "mouse") return;

    longPressFiredRef.current = false;
    startXYRef.current = { x: e.clientX, y: e.clientY };

    clearTimer();
    timerRef.current = window.setTimeout(() => {
      longPressFiredRef.current = true;
      onToggleFavorite(glyph);

      // Optional: tactile feedback on supported devices
      navigator.vibrate?.(12);
    }, LONGPRESS_MS);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (timerRef.current == null || !startXYRef.current) return;

    const dx = Math.abs(e.clientX - startXYRef.current.x);
    const dy = Math.abs(e.clientY - startXYRef.current.y);

    // Cancel long-press if the user scrolls/drags.
    if (dx > 10 || dy > 10) clearTimer();
  };

  const handlePointerUpOrCancel = () => {
    clearTimer();
    startXYRef.current = null;
  };

  const handleMainClick = (e: React.MouseEvent) => {
    // If a long-press already toggled favorite, suppress the click action (copy).
    if (longPressFiredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      longPressFiredRef.current = false;
      return;
    }
    onCopy(glyph);
  };

  return (
    <div
      className={`glyph-tile ${className}`}
      data-category={glyph.category}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onContextMenu={(e) => {
        // Prevent iOS/Android long-press context menu from interfering.
        if (!hoverCapable) e.preventDefault();
      }}
    >
      {/* MAIN */}
      <button
        type="button"
        className="glyph-tile__main"
        onClick={handleMainClick}
      >
        <span className="glyph-tile__symbol" aria-hidden="true">
          {glyph.symbol}
        </span>
        <span className="glyph-tile__name">{glyph.name}</span>
      </button>

      {/* FAVORITE */}
      <button
        type="button"
        className={`glyph-tile__favorite ${isFavorite ? "is-favorite" : ""}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(glyph); // toggles on/off
        }}
      >
        <svg
          className="icon icon--star"
          viewBox="0 -960 960 960"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path fill="currentColor" d={isFavorite ? STAR_FILLED : STAR_OUTLINE} />
        </svg>
      </button>

      {/* DETAILS */}
      <button
        type="button"
        className="glyph-tile__details"
        aria-label="Show details"
        onClick={(e) => {
          e.stopPropagation();
          onShowDetails(glyph);
        }}
      >
        <svg
          className="icon icon--details"
          viewBox="0 -960 960 960"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M479.63-171.23q-27.38 0-46.5-19.5Q414-210.23 414-237.6q0-27.38 19.5-46.51 
            19.49-19.12 46.87-19.12t46.5 19.5Q546-264.24 546-236.86t-19.5 46.5q-19.49 19.13-46.87 
            19.13Zm0-242.77q-27.38 0-46.5-19.5Q414-452.99 414-480.37t19.5-46.5Q452.99-546 480.37-546t46.5 
            19.5Q546-507.01 546-479.63t-19.5 46.5Q507.01-414 479.63-414Zm0-242.77q-27.38 0-46.5-19.5Q414-695.76 
            414-723.14t19.5-46.5q19.49-19.13 46.87-19.13t46.5 19.5Q546-749.77 546-722.4q0 27.38-19.5 
            46.51-19.49 19.12-46.87 19.12Z"
          />
        </svg>
      </button>
    </div>
  );
}