export type TarotSpreadPosition = {
  id: string;
  title: string;
  description: string;
};

export type TarotSpreadDefinition<TSpreadId extends string = string> = {
  id: TSpreadId;
  name: string;
  shortLabel: string;
  cardCount: number;
  description: string;
  positions: readonly TarotSpreadPosition[];
};

const tarotSpreadRegistry = {
  "single-card": defineSpread({
    id: "single-card",
    name: "单张牌",
    shortLabel: "一张牌",
    cardCount: 1,
    description: "适合快速聚焦当下状态、情绪线索或一个最值得被看见的提醒。",
    positions: [
      {
        id: "insight",
        title: "当下提示",
        description: "这张牌代表此刻最值得你停下来观察的能量、情绪或视角。",
      },
    ],
  }),
  "past-present-guidance": defineSpread({
    id: "past-present-guidance",
    name: "过去 / 现在 / 建议",
    shortLabel: "三张牌",
    cardCount: 3,
    description: "适合梳理一个问题的发展脉络，帮助用户看清来处、现状与下一步方向。",
    positions: [
      {
        id: "past",
        title: "过去",
        description: "回看已经发生的影响因素，理解问题是如何走到当下这一步的。",
      },
      {
        id: "present",
        title: "现在",
        description: "聚焦当前最核心的状态、张力或需要被承认的现实。",
      },
      {
        id: "guidance",
        title: "建议",
        description: "提供一个更温和、低风险的下一步视角，而不是替你做决定。",
      },
    ],
  }),
} as const;

export type TarotSpreadId = keyof typeof tarotSpreadRegistry;

const tarotSpreadOrder = ["single-card", "past-present-guidance"] as const satisfies readonly TarotSpreadId[];

export function listTarotSpreads(): readonly TarotSpreadDefinition<TarotSpreadId>[] {
  return tarotSpreadOrder.map((spreadId) => tarotSpreadRegistry[spreadId]);
}

export function getTarotSpread(spreadId: TarotSpreadId): TarotSpreadDefinition<TarotSpreadId>;
export function getTarotSpread(spreadId: string): TarotSpreadDefinition<TarotSpreadId> | undefined;
export function getTarotSpread(spreadId: string) {
  if (!isTarotSpreadId(spreadId)) {
    return undefined;
  }

  return tarotSpreadRegistry[spreadId];
}

export function isTarotSpreadId(value: string): value is TarotSpreadId {
  return value in tarotSpreadRegistry;
}

function defineSpread<TSpreadId extends string>(
  spread: TarotSpreadDefinition<TSpreadId>,
): Readonly<TarotSpreadDefinition<TSpreadId>> {
  if (spread.positions.length !== spread.cardCount) {
    throw new Error(`Spread \"${spread.id}\" must define exactly ${spread.cardCount} positions.`);
  }

  return Object.freeze({
    ...spread,
    positions: Object.freeze([...spread.positions]),
  });
}