import { useState } from "react";
import { disclaimerContent } from "../content/disclaimer";

type DisclaimerPanelProps = {
  mode: "panel" | "confirm";
  isAcknowledged: boolean;
  onAcknowledge?: () => void;
  onBackHome?: () => void;
  onClose?: () => void;
};

export function DisclaimerPanel({
  mode,
  isAcknowledged,
  onAcknowledge,
  onBackHome,
  onClose,
}: DisclaimerPanelProps) {
  const [hasChecked, setHasChecked] = useState(false);
  const isConfirmMode = mode === "confirm";
  const shouldShowAcknowledgeButton = !isConfirmMode && !isAcknowledged && Boolean(onAcknowledge);

  return (
    <article className="surface-card disclaimer-card">
      <div className="disclaimer-header">
        <div>
          <p className="section-label">
            {isConfirmMode ? disclaimerContent.gateLabel : disclaimerContent.sectionLabel}
          </p>
          <h2 id={!isConfirmMode ? "disclaimer-dialog-title" : undefined}>
            {disclaimerContent.title}
          </h2>
        </div>

        {!isConfirmMode && (
          <span className="entry-badge disclaimer-status">
            {isAcknowledged
              ? disclaimerContent.acknowledgedStatusLabel
              : disclaimerContent.reviewStatusLabel}
          </span>
        )}
      </div>

      <p className="lede">{disclaimerContent.intro}</p>

      {!isConfirmMode && <p className="helper-note disclaimer-helper">{disclaimerContent.panelLead}</p>}

      <ul className="bullet-list disclaimer-list">
        {disclaimerContent.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {isConfirmMode ? (
        <>
          <label className="disclaimer-check">
            <input
              checked={hasChecked}
              onChange={(event) => setHasChecked(event.target.checked)}
              type="checkbox"
            />
            <span>{disclaimerContent.confirmationLabel}</span>
          </label>

          <div className="action-row">
            <button
              className="primary-button"
              disabled={!hasChecked}
              onClick={onAcknowledge}
              type="button"
            >
              {disclaimerContent.confirmButtonLabel}
            </button>
            <button className="secondary-button" onClick={onBackHome} type="button">
              {disclaimerContent.backButtonLabel}
            </button>
          </div>
        </>
      ) : (
        <div className="action-row">
          {shouldShowAcknowledgeButton && (
            <button className="primary-button" onClick={onAcknowledge} type="button">
              {disclaimerContent.acknowledgeButtonLabel}
            </button>
          )}
          <button className="secondary-button" onClick={onClose} type="button">
            {disclaimerContent.closeButtonLabel}
          </button>
        </div>
      )}
    </article>
  );
}