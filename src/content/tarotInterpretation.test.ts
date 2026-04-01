import { describe, expect, it } from "vitest";
import { createTarotInterpretation, listTarotReadingTopics } from "./tarotInterpretation";
import { majorArcanaSampleCards } from "./tarotDeck";

const fool = majorArcanaSampleCards[0];
const magician = majorArcanaSampleCards[1];

describe("tarotInterpretation", () => {
  it("lists supported reading topics in a stable shape", () => {
    const topics = listTarotReadingTopics();

    expect(topics.map((topic) => topic.id)).toEqual([
      "general",
      "love",
      "relationship",
      "career",
      "study",
      "daily-inspiration",
    ]);
  });

  it("builds a deterministic interpretation from card, orientation, topic, and spread position", () => {
    const first = createTarotInterpretation({
      card: fool,
      orientation: "upright",
      topic: "love",
      spreadId: "past-present-guidance",
      positionId: "present",
    });

    const second = createTarotInterpretation({
      card: fool,
      orientation: "upright",
      topic: "love",
      spreadId: "past-present-guidance",
      positionId: "present",
    });

    const loveTopic = listTarotReadingTopics().find((topic) => topic.id === "love");

    expect(first).toEqual(second);
    expect(first.orientationLabel).toBe("正位");
    expect(first.topicLabel).toBe(loveTopic?.label);
    expect(first.keywords).toEqual(fool.uprightKeywords);
    expect(first.position?.id).toBe("present");
    expect(first.possibility.length).toBeGreaterThan(0);
    expect(first.meaning.length).toBeGreaterThan(0);
    expect(first.possibility).not.toBe(first.meaning);
  });

  it("switches meaning, keywords, and tone for reversed cards", () => {
    const result = createTarotInterpretation({
      card: magician,
      orientation: "reversed",
      topic: "career",
    });

    const careerTopic = listTarotReadingTopics().find((topic) => topic.id === "career");

    expect(result.orientationLabel).toBe("逆位");
    expect(result.keywords).toEqual(magician.reversedKeywords);
    expect(result.meaning).toContain(magician.reversedMeaning);
    expect(result.meaning).toContain(careerTopic?.label ?? "");
    expect(result.reflectionQuestion).toContain(careerTopic?.label ?? "");
    expect(magician.gentleActions.some((action) => result.gentleAction.includes(action))).toBe(true);
  });

  it("defaults to the first spread position when spreadId is provided without a positionId", () => {
    const result = createTarotInterpretation({
      card: fool,
      orientation: "upright",
      spreadId: "single-card",
    });

    expect(result.position?.id).toBe("insight");
  });

  it("throws when the provided position does not belong to the spread", () => {
    expect(() =>
      createTarotInterpretation({
        card: fool,
        orientation: "upright",
        spreadId: "single-card",
        positionId: "guidance",
      }),
    ).toThrow('Position "guidance" is not defined for spread "single-card".');
  });
});
