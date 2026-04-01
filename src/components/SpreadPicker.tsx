import type { TarotSpreadDefinition, TarotSpreadId } from "../core/tarotSpreads";

type SpreadPickerProps = {
  spreads: readonly TarotSpreadDefinition<TarotSpreadId>[];
  selectedSpreadId: TarotSpreadId;
  onSelect: (spreadId: TarotSpreadId) => void;
};

const spreadHints: Partial<Record<TarotSpreadId, string>> = {
  "single-card": "快速聚焦",
  "past-present-guidance": "梳理脉络",
};

export function SpreadPicker({
  spreads,
  selectedSpreadId,
  onSelect,
}: SpreadPickerProps) {
  return (
    <div className="spread-grid" role="list" aria-label="抽牌模式选择">
      {spreads.map((spread) => {
        const isActive = spread.id === selectedSpreadId;
        const spreadHint = spreadHints[spread.id] ?? "选择牌阵";

        return (
          <button
            aria-pressed={isActive}
            className={`spread-button${isActive ? " is-active" : ""}`}
            key={spread.id}
            onClick={() => onSelect(spread.id)}
            type="button"
          >
            <div className="spread-header">
              <div className="spread-heading">
                <span className="spread-title">{spread.name}</span>
                <span className="spread-kicker">{spreadHint}</span>
              </div>
              <span className="entry-badge">{spread.cardCount} 张牌</span>
            </div>

            <p className="spread-copy">{spread.description}</p>

            <div className="spread-footer">
              <span className="spread-meta-label">位置结构</span>
              <p className="spread-meta">
                {spread.positions.map((position) => position.title).join(" / ")}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
