import { useEffect } from "react";
import "@/styles/undoBar.scss";

type Props = {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
  className?: string;
};

export default function UndoBar({
  message,
  onUndo,
  onDismiss,
  durationMs = 5000,
  className = "",
}: Props) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [onDismiss, durationMs]);

  return (
    <div className={`undo-bar ${className}`} role="status" aria-live="polite">
      <span className="undo-bar__message">{message}</span>
      <button type="button" className="undo-bar__undo" onClick={onUndo}>
        Undo
      </button>
      <button
        type="button"
        className="undo-bar__dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
