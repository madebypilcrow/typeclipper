import { useEffect, useState } from "react";
import "@/styles/undoBar.scss";

type Props = {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number; // if undefined / 0 → permanent
  className?: string;
};

const EXIT_MS = 180;

export default function UndoBar({
  message,
  onUndo,
  onDismiss,
  durationMs,
  className = "",
}: Props) {
  const [isEntering, setIsEntering] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsEntering(false));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const dismiss = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onDismiss, EXIT_MS);
  };

  useEffect(() => {
    if (!durationMs) return;

    const t = window.setTimeout(dismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs]);

  const handleUndo = () => {
    onUndo();
    dismiss();
  };

  return (
    <div
      className={[
        "undo-bar",
        isEntering ? "is-entering" : "",
        isClosing ? "is-closing" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <span className="undo-bar__message">{message}</span>

      <button type="button" className="undo-bar__undo" onClick={handleUndo}>
        Undo
      </button>

      <button
        type="button"
        className="undo-bar__dismiss"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          width="20"
          height="20"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M480-429 363.09-313Q352-302 338-302t-25-11q-11-11-11-25t11-25.09L429-480 313-595.91Q302-607 302-621t11-25q11-11 25-11t25.09 11L480-530l115.91-116Q607-657 621-657t25 11q11 11 11 25t-11 25.09L530-480l116 116.91Q657-352 657-338t-11 25q-11 11-25 11t-25.09-11L480-429Z" />
        </svg>
      </button>
    </div>
  );
}
