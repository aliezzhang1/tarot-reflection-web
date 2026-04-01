import { describe, expect, it } from "vitest";
import { createTarotInterpretation } from "../content/tarotInterpretation";
import { majorArcanaSampleCards } from "../content/tarotDeck";
import { getTarotSpread } from "../core/tarotSpreads";
import {
  buildReadingResult,
  buildReadingShareCard,
  createDailyDrawSeed,
  dailyDrawDraft,
  getReadingShareCardSize,
  renderReadingShareCardSvg,
  type ReadingResult,
} from "./readingFlow";

describe("buildReadingShareCard", () => {
  it("creates a share summary without leaking the original question", () => {
    const spread = getTarotSpread("single-card");

    if (!spread) {
      throw new Error("single-card spread should exist");
    }

    const result: ReadingResult = {
      topic: "love",
      question: "我们会不会马上复合？",
      spreadId: "single-card",
      seed: "seed-1",
      createdAt: "2026-03-30T10:00:00.000Z",
      items: [
        {
          draw: {
            card: majorArcanaSampleCards[0],
            orientation: "upright",
            drawIndex: 0,
            sourceIndex: 0,
          },
          position: spread.positions[0],
          interpretation: createTarotInterpretation({
            card: majorArcanaSampleCards[0],
            orientation: "upright",
            topic: "love",
            spreadId: spread.id,
            positionId: spread.positions[0].id,
          }),
        },
      ],
    };

    const shareCard = buildReadingShareCard(result);

    expect(shareCard.cards).toHaveLength(1);
    expect(shareCard.dateLabel).toBe("2026.03.30");
    expect(shareCard.copyText).toContain("塔罗灵感分享卡");
    expect(shareCard.copyText).not.toContain(result.question);
    expect(shareCard.reflectionLine).toContain("也许");
    expect(shareCard.fileName).toContain(".png");
  });

  it("provides a stable size and local svg card without leaking the original question", () => {
    const spread = getTarotSpread("single-card");

    if (!spread) {
      throw new Error("single-card spread should exist");
    }

    const result: ReadingResult = {
      topic: "love",
      question: "我们会不会马上复合？",
      spreadId: "single-card",
      seed: "seed-1",
      createdAt: "2026-03-30T10:00:00.000Z",
      items: [
        {
          draw: {
            card: majorArcanaSampleCards[0],
            orientation: "upright",
            drawIndex: 0,
            sourceIndex: 0,
          },
          position: spread.positions[0],
          interpretation: createTarotInterpretation({
            card: majorArcanaSampleCards[0],
            orientation: "upright",
            topic: "love",
            spreadId: spread.id,
            positionId: spread.positions[0].id,
          }),
        },
      ],
    };

    const shareCard = buildReadingShareCard(result);
    const size = getReadingShareCardSize(shareCard);
    const svg = renderReadingShareCardSvg(shareCard);

    expect(size.width).toBe(1080);
    expect(size.height).toBeGreaterThan(500);
    expect(svg).toContain("塔罗灵感分享卡");
    expect(svg).toContain("2026.03.30");
    expect(svg).toContain(majorArcanaSampleCards[0].nameCn);
    expect(svg).not.toContain(result.question);
  });
});

describe("daily draw helpers", () => {
  it("creates a daily seed that keeps the date and supports fresh draws", () => {
    const seed = createDailyDrawSeed(new Date(2026, 2, 30, 8, 30, 0), "draw-1");

    expect(seed).toBe("daily-draw:daily-inspiration:2026-03-30:draw-1");
  });

  it("builds a deterministic single-card daily draw result when the seed is fixed", () => {
    const seed = "daily-draw:daily-inspiration:2026-03-30:draw-1";
    const resultA = buildReadingResult({
      draft: dailyDrawDraft,
      spreadId: "single-card",
      seed,
      createdAt: "2026-03-30T08:00:00.000Z",
    });
    const resultB = buildReadingResult({
      draft: dailyDrawDraft,
      spreadId: "single-card",
      seed,
      createdAt: "2026-03-30T08:00:00.000Z",
    });

    expect(resultA.topic).toBe("daily-inspiration");
    expect(resultA.question).toBe("");
    expect(resultA.items).toHaveLength(1);
    expect(resultA.items[0].draw.card.id).toBe(resultB.items[0].draw.card.id);
    expect(resultA.items[0].draw.orientation).toBe(resultB.items[0].draw.orientation);
  });
});

