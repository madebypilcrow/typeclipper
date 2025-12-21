import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { Glyph } from "@/types/glyph";
import "@/styles/glyphDetailsModal.scss";

type Props = {
  isOpen: boolean;
  glyph: Glyph | null;

  isFavorite: boolean;
  onToggleFavorite: (g: Glyph) => void;

  onClose: () => void;

  // Optional: if you want a different base path later
  glyphsPath?: string; // default "/typeclipper"
};

const COPY_RESET_MS = 1200;

const STAR_FILLED =
  "M480-272 312.5-171q-10.5 6.5-21.75 5.5T271-173q-8.5-6.5-13-16.5t-1.5-22L301-402 153-530q-9.5-8.5-12-19.25t1-20.75q3.5-10 11.75-17t20.75-8.5l195-17 76-179.5q5-11.5 14.5-17t20-5.5q10.5 0 20 5.5t14.5 17l76 179.5 195 17q12.5 1.5 20.75 8.5T818-570q3.5 10 1 20.75T807-530L659-402l44.5 190.5q3 12-1.5 22T689-173q-8.5 6.5-19.75 7.5T647.5-171L480-272Z";

const STAR_OUTLINE =
  "M350-281.5 480-360l130 79-34.5-148 115-99-151-13.5-59.5-140L420.5-542l-151 13 115 99.5-34.5 148Zm130 9.5L312.5-171q-10.5 6.5-21.75 5.5T271-173q-8.5-6.5-13-16.5t-1.5-22L301-402 153-530q-9.5-8.5-12-19.25t1-20.75q3.5-10 11.75-17t20.75-8.5l195-17 76-179.5q5-11.5 14.5-17t20-5.5q10.5 0 20 5.5t14.5 17l76 179.5 195 17q12.5 1.5 20.75 8.5T818-570q3.5 10 1 20.75T807-530L659-402l44.5 190.5q3 12-1.5 22T689-173q-8.5 6.5-19.75 7.5T647.5-171L480-272Zm0-199Z";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function useTouchModalMode() {
  const [isTouchLike, setIsTouchLike] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const update = () => setIsTouchLike(!Boolean(mq?.matches));
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  return isTouchLike;
}

export default function GlyphDetailsModal({
  isOpen,
  glyph,
  isFavorite,
  onToggleFavorite,
  onClose,
  glyphsPath = "/typeclipper",
}: Props) {
  const navigate = useNavigate();
  const isTouchLike = useTouchModalMode();

  const [copiedField, setCopiedField] = useState<null | "header" | "unicode" | "html">(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const titleId = useMemo(() => (glyph ? `glyph-title-${glyph.unicode}` : "glyph-title"), [glyph]);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;

    // Focus after mount
    const t = window.setTimeout(() => {
      // Prefer close button, then dialog itself
      closeBtnRef.current?.focus();
      if (!closeBtnRef.current) dialogRef.current?.focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Minimal focus trap (Tab cycles within dialog)
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;

        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

        if (focusables.length === 0) {
          e.preventDefault();
          root.focus();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);

      // Restore focus
      lastActiveRef.current?.focus?.();
      lastActiveRef.current = null;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCopiedField(null);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!copiedField) return;
    const t = window.setTimeout(() => setCopiedField(null), COPY_RESET_MS);
    return () => window.clearTimeout(t);
  }, [copiedField]);

  if (!isOpen || !glyph) return null;

  const modal = (
    <div className="glyph-modal" role="presentation">
      <div
        className="glyph-modal__backdrop"
        onMouseDown={(e) => {
          // Only close if clicking backdrop itself
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className={`glyph-modal__dialog ${isTouchLike ? "is-sheet" : "is-centered"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          ref={dialogRef}
        >
          <header className="glyph-modal__header">
            <button
              type="button"
              className="glyph-modal__close"
              aria-label="Close"
              onClick={onClose}
              ref={closeBtnRef}
            >
              ×
            </button>

            <button
              type="button"
              className="glyph-modal__title"
              onClick={async () => {
                const ok = await copyText(glyph.symbol);
                if (ok) setCopiedField("header");
              }}
            >
              <span className="glyph-modal__symbol" aria-hidden="true">
                {glyph.symbol}
              </span>
              <span className="glyph-modal__name" id={titleId}>
                {glyph.name}
              </span>
              {copiedField === "header" && (
                <span className="glyph-modal__copied" aria-live="polite">
                  Copied!
                </span>
              )}
            </button>

            <button
              type="button"
              className={`glyph-modal__favorite ${isFavorite ? "is-favorite" : ""}`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              onClick={() => onToggleFavorite(glyph)}
            >
              <svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true">
                <path fill="currentColor" d={isFavorite ? STAR_FILLED : STAR_OUTLINE} />
              </svg>
            </button>
          </header>

          <div className="glyph-modal__rows">
            <div className="glyph-modal__row">
              <div className="glyph-modal__label">Unicode</div>
              <div className="glyph-modal__value">
                <button
                  type="button"
                  className="glyph-modal__chip"
                  onClick={async () => {
                    const ok = await copyText(glyph.unicode);
                    if (ok) setCopiedField("unicode");
                  }}
                >
                  {glyph.unicode}
                </button>
                {copiedField === "unicode" && (
                  <span className="glyph-modal__inline-ok" aria-live="polite">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            <div className="glyph-modal__row">
              <div className="glyph-modal__label">HTML Entity</div>
              <div className="glyph-modal__value">
                <button
                  type="button"
                  className="glyph-modal__chip"
                  onClick={async () => {
                    const ok = await copyText(glyph.html);
                    if (ok) setCopiedField("html");
                  }}
                >
                  {glyph.html}
                </button>
                {copiedField === "html" && (
                  <span className="glyph-modal__inline-ok" aria-live="polite">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            <div className="glyph-modal__row">
              <div className="glyph-modal__label">Category</div>
              <div className="glyph-modal__value">
                <button
                  type="button"
                  className="glyph-modal__link"
                  onClick={() => {
                    onClose();
                    navigate(`${glyphsPath}?cat=${encodeURIComponent(glyph.category)}`, {
                      replace: false,
                    });
                  }}
                >
                  {glyph.category}
                </button>
              </div>
            </div>
          </div>

          <div className="glyph-modal__description">
            {glyph.description ?? "Description to be added soon"}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}