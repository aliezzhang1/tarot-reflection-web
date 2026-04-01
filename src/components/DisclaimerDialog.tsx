import type { MouseEvent } from "react";
import { DisclaimerPanel } from "./DisclaimerPanel";

type DisclaimerDialogProps = {
  isAcknowledged: boolean;
  isOpen: boolean;
  onAcknowledge: () => void;
  onClose: () => void;
};

export function DisclaimerDialog({
  isAcknowledged,
  isOpen,
  onAcknowledge,
  onClose,
}: DisclaimerDialogProps) {
  if (!isOpen) {
    return null;
  }

  const stopClosing = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      aria-labelledby="disclaimer-dialog-title"
      aria-modal="true"
      className="disclaimer-overlay"
      onClick={onClose}
      role="dialog"
    >
      <div className="disclaimer-overlay-card" onClick={stopClosing}>
        <DisclaimerPanel
          isAcknowledged={isAcknowledged}
          mode="panel"
          onAcknowledge={onAcknowledge}
          onClose={onClose}
        />
      </div>
    </div>
  );
}