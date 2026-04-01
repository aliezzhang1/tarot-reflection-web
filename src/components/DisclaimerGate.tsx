import { DisclaimerPanel } from "./DisclaimerPanel";

type DisclaimerGateProps = {
  onAccept: () => void;
  onBackHome: () => void;
};

export function DisclaimerGate({ onAccept, onBackHome }: DisclaimerGateProps) {
  return (
    <section className="disclaimer-shell">
      <DisclaimerPanel
        isAcknowledged={false}
        mode="confirm"
        onAcknowledge={onAccept}
        onBackHome={onBackHome}
      />
    </section>
  );
}