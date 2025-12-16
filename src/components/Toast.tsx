import { useEffect } from "react";
import { createPortal } from "react-dom";
import "@/styles/toast.scss";

type ToastProps = {
  message: string;
  duration?: number;
  onClose: () => void;
};

export default function Toast({ message, duration = 1400, onClose }: ToastProps) {
  useEffect(() => {
    const t = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(t);
  }, [duration, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>,
    document.body
  );
}