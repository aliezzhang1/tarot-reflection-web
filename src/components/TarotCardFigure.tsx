import type { TarotCardDefinition } from "../content/tarotDeck";
import { getTarotCardArtwork } from "../content/tarotCardArtwork";

type TarotCardFigureProps = {
  card: TarotCardDefinition;
  orientation?: "upright" | "reversed";
};

export function TarotCardFigure({
  card,
  orientation = "upright",
}: TarotCardFigureProps) {
  const artwork = getTarotCardArtwork(card.id);
  const imageSrc = card.imageSrc ?? artwork?.imageSrc;
  const imageAlt = card.imageAlt ?? artwork?.imageAlt ?? `${card.nameCn}牌面插图`;

  if (!imageSrc) {
    return null;
  }

  return (
    <figure className={`tarot-card-figure${orientation === "reversed" ? " is-reversed" : ""}`}>
      <div className="tarot-card-flipper">
        <div className="tarot-card-face tarot-card-back-face" aria-hidden="true"></div>
        <div className="tarot-card-face tarot-card-frame">
          <img alt={imageAlt} className="tarot-card-image" loading="lazy" src={imageSrc} />
          {orientation === "reversed" && <span className="tarot-card-orientation">逆位</span>}
        </div>
      </div>
    </figure>
  );
}
