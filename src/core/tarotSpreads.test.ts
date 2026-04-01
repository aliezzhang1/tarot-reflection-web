import { describe, expect, it } from "vitest";
import { getTarotSpread, isTarotSpreadId, listTarotSpreads } from "./tarotSpreads";

describe("tarotSpreads", () => {
  it("lists supported spreads in a stable display order", () => {
    const spreads = listTarotSpreads();

    expect(spreads.map((spread) => spread.id)).toEqual([
      "single-card",
      "past-present-guidance",
    ]);
  });

  it("keeps cardCount aligned with the number of configured positions", () => {
    const spreads = listTarotSpreads();

    for (const spread of spreads) {
      expect(spread.positions).toHaveLength(spread.cardCount);
    }
  });

  it("returns metadata for the three-card spread", () => {
    const spread = getTarotSpread("past-present-guidance");

    expect(spread).toMatchObject({
      name: "过去 / 现在 / 建议",
      cardCount: 3,
    });
    expect(spread?.positions.map((position) => position.title)).toEqual([
      "过去",
      "现在",
      "建议",
    ]);
  });

  it("returns undefined for unknown spread ids", () => {
    expect(getTarotSpread("relationship-triangle")).toBeUndefined();
  });

  it("can identify whether a string is a supported spread id", () => {
    expect(isTarotSpreadId("single-card")).toBe(true);
    expect(isTarotSpreadId("unknown-spread")).toBe(false);
  });
});