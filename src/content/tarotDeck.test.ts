import { describe, expect, it } from "vitest";
import {
  getTarotCardById,
  majorArcanaCollectionMeta,
  majorArcanaDeck,
  majorArcanaPrototypeDeck,
  majorArcanaSampleCards,
} from "./tarotDeck";
import { majorArcanaArtworkMap } from "./tarotCardArtwork";

describe("tarotDeck content schema", () => {
  it("keeps full deck ids unique", () => {
    const ids = majorArcanaDeck.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps full deck numbers unique", () => {
    const numbers = majorArcanaDeck.map((card) => card.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(Math.min(...numbers)).toBe(0);
    expect(Math.max(...numbers)).toBe(21);
  });

  it("stores cards in a front-end-friendly shape", () => {
    for (const card of majorArcanaDeck) {
      expect(card.arcana).toBe("major");
      expect(card.suit).toBe("major-arcana");
      expect(card.uprightKeywords.length).toBeGreaterThan(0);
      expect(card.reversedKeywords.length).toBeGreaterThan(0);
      expect(card.reflectionQuestions.length).toBeGreaterThan(0);
      expect(card.gentleActions.length).toBeGreaterThan(0);
      expect(card.imageSrc).toMatch(/^\/cards\/major-arcana\//);
      expect(card.imageAlt).toBeTruthy();
    }
  });

  it("keeps a sample slice for smaller content tests", () => {
    expect(majorArcanaSampleCards).toHaveLength(2);
    expect(majorArcanaSampleCards[0].id).toBe("major-fool");
    expect(majorArcanaSampleCards[1].id).toBe("major-magician");
  });

  it("uses the full deck for draw flow compatibility", () => {
    expect(majorArcanaPrototypeDeck.length).toBe(22);
  });

  it("can resolve a card by id", () => {
    const card = getTarotCardById("major-fool");
    expect(card?.nameEn).toBe("The Fool");
  });

  it("exposes collection metadata for the complete major arcana set", () => {
    expect(majorArcanaCollectionMeta.totalCards).toBe(22);
    expect(majorArcanaCollectionMeta.includedSampleCount).toBe(2);
    expect(majorArcanaCollectionMeta.prototypeDeckCount).toBe(22);
    expect(majorArcanaCollectionMeta.fullDeckCount).toBe(22);
    expect(majorArcanaCollectionMeta.artworkCount).toBe(22);
  });

  it("keeps a local artwork mapping for the full major arcana set", () => {
    expect(Object.keys(majorArcanaArtworkMap)).toHaveLength(22);
  });
});
