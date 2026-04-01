import { majorArcanaBackArtwork } from "../content/tarotCardArtwork";

export type DeckPreviewPhase = "idle" | "centering" | "shuffling";

type DeckPreviewProps = {
  cardCount: number;
  phase: DeckPreviewPhase;
};

export function DeckPreview({ cardCount, phase }: DeckPreviewProps) {
  const previewCount = cardCount >= 3 ? 3 : 1;
  const variant = previewCount === 3 ? "is-three" : "is-single";

  return (
    <div className={`simple-deck-preview ${variant} is-${phase}`} aria-hidden="true">
      <div className="simple-deck-preview-halo" />

      <div className="simple-deck-stack">
        {Array.from({ length: previewCount }, (_, index) => (
          <div className={`simple-deck-card simple-deck-card--${index + 1}`} key={index}>
            <img
              alt=""
              className="simple-deck-image"
              draggable={false}
              loading="eager"
              src={majorArcanaBackArtwork.imageSrc}
            />
          </div>
        ))}
      </div>

      <span className="simple-deck-count">{cardCount === 1 ? "单张牌" : `${cardCount} 张牌`}</span>
    </div>
  );
}
