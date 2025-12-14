import { useState } from "react";

type Props = {
  onClear: () => void;
  label?: string;
  confirmText?: string;
  className?: string;
  disabled?: boolean;
};

export default function ClearAllButton({
  onClear,
  label = "Clear all",
  confirmText = "Click again to confirm",
  className = "",
  disabled = false,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 2200);
      return;
    }

    setConfirming(false);
    onClear();
  };

  return (
    <button
      type="button"
      className={`clear-all-btn ${confirming ? "is-confirming" : ""} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      {confirming ? confirmText : label}
    </button>
  );
}