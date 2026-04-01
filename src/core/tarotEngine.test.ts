import { describe, expect, it } from "vitest";
import { drawTarotCards, shuffleDeck } from "./tarotEngine";

const mockDeck = [
  { id: "fool", name: "The Fool" },
  { id: "magician", name: "The Magician" },
  { id: "high-priestess", name: "The High Priestess" },
  { id: "empress", name: "The Empress" },
  { id: "emperor", name: "The Emperor" },
  { id: "hierophant", name: "The Hierophant" },
] as const;

describe("drawTarotCards", () => {
  it("draws the requested number of unique cards without mutating the input deck", () => {
    const originalDeck = [...mockDeck];
    const draw = drawTarotCards({ deck: mockDeck, count: 3, seed: "new-moon" });

    expect(draw).toHaveLength(3);
    expect(new Set(draw.map((entry) => entry.card.id)).size).toBe(3);
    expect(mockDeck).toEqual(originalDeck);
    expect(draw.every((entry) => entry.orientation === "upright" || entry.orientation === "reversed")).toBe(true);
  });

  it("returns the same result when the same seed is reused", () => {
    const firstDraw = drawTarotCards({ deck: mockDeck, count: 3, seed: "spring-equinox" });
    const secondDraw = drawTarotCards({ deck: mockDeck, count: 3, seed: "spring-equinox" });

    expect(firstDraw).toEqual(secondDraw);
  });

  it("supports single-card draws and records the original source index", () => {
    const [drawnCard] = drawTarotCards({ deck: mockDeck, count: 1, seed: 7 });

    expect(drawnCard.drawIndex).toBe(0);
    expect(drawnCard.sourceIndex).toBeGreaterThanOrEqual(0);
    expect(drawnCard.sourceIndex).toBeLessThan(mockDeck.length);
  });

  it("throws when the requested count exceeds the deck size", () => {
    expect(() => drawTarotCards({ deck: mockDeck, count: 7, seed: "overflow" })).toThrow(
      "Draw count cannot exceed deck size.",
    );
  });
});

describe("shuffleDeck", () => {
  it("keeps the shuffle stable for the same seed", () => {
    const firstShuffle = shuffleDeck(mockDeck, "harvest").map((card) => card.id);
    const secondShuffle = shuffleDeck(mockDeck, "harvest").map((card) => card.id);

    expect(firstShuffle).toEqual(secondShuffle);
  });

  it("produces a different ordering for different seeds", () => {
    const firstShuffle = shuffleDeck(mockDeck, "harvest").map((card) => card.id);
    const secondShuffle = shuffleDeck(mockDeck, "solstice").map((card) => card.id);

    expect(firstShuffle).not.toEqual(secondShuffle);
  });
});