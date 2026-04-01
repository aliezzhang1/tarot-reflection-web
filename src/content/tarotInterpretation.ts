import type { CardOrientation } from "../core/tarotEngine";
import {
  getTarotSpread,
  type TarotSpreadId,
  type TarotSpreadPosition,
} from "../core/tarotSpreads";
import type { TarotCardDefinition } from "./tarotDeck";

const topicRegistry = {
  general: {
    label: "全局",
    focus: "此刻最值得留意的整体动向",
    reflectionArea: "心里反复浮现、却还没说清的问题",
    actionArea: "眼下最容易落地的一小步",
    meaningAngles: [
      "也许更值得先看清那条正在慢慢成形的主线",
      "不妨先辨认什么正在自然展开，而不急着定论",
      "可以先把注意力放回最有回应的那一处",
    ],
  },
  love: {
    label: "亲密",
    focus: "关系里真实的靠近、迟疑与期待",
    reflectionArea: "这段情感里最需要被照顾的感受",
    actionArea: "关系里更温和的一次回应",
    meaningAngles: [
      "可以多留意情感如何靠近、退开或停顿",
      "更适合先看清感受的流动，而不是抢着要答案",
      "也许重点不在结果，而在彼此真实的需要有没有被看见",
    ],
  },
  relationship: {
    label: "联结",
    focus: "互动中的距离感、边界与回应方式",
    reflectionArea: "这段关系里你真正想守住的部分",
    actionArea: "互动里更清楚也更温和的一次表达",
    meaningAngles: [
      "更适合去看关系里的距离、边界和回应",
      "也许先理解彼此站在哪里，比立刻推进更重要",
      "可以先留意互动里真正让你起波动的地方",
    ],
  },
  career: {
    label: "事业",
    focus: "现实推进中的方向、资源与节奏",
    reflectionArea: "工作里最值得重新分配精力的部分",
    actionArea: "现实中能马上推进的一步",
    meaningAngles: [
      "更适合先整理资源、节奏和现实方向",
      "可以先辨认什么值得继续加力，什么该暂时放下",
      "也许关键不是做更多，而是把力气放对地方",
    ],
  },
  study: {
    label: "学习",
    focus: "注意力、方法与学习节奏的变化",
    reflectionArea: "你最需要重新整理的学习状态",
    actionArea: "帮助你回到节奏的一次微调",
    meaningAngles: [
      "更适合先看清注意力和方法哪里需要调整",
      "也许重点不在学得更久，而在学得更顺",
      "可以先把节奏理顺，再谈进度和结果",
    ],
  },
  "daily-inspiration": {
    label: "今日灵感",
    focus: "今天最值得留意的一束微光",
    reflectionArea: "这一天里最值得回望的小提示",
    actionArea: "今天就能尝试的一个轻动作",
    meaningAngles: [
      "不妨把它当作今天的一束提示，而不是最终答案",
      "也许只要先看见这张牌照亮的那一点点就够了",
      "今天更适合轻轻接住它，而不是急着解释完它",
    ],
  },
} as const;

const orientationRegistry = {
  upright: {
    label: "正位",
    toneLead: [
      "它更像是在提醒你：有些线索已经开始浮现，只是需要一点安静去看见。",
      "它像一盏落在手边的小灯，让你先看清眼前真正正在发生的变化。",
      "它给出的不是答案本身，而是一条值得继续顺着往前看的线索。",
    ],
    meaningTail: [
      "先顺着这条线索慢慢展开就好。",
      "现在适合带着一点信任继续观察。",
      "不必急着证明什么，先让它自然显形。",
    ],
  },
  reversed: {
    label: "逆位",
    toneLead: [
      "它不像否定，更像是在提醒你先看清哪里正在卡住。",
      "它像一声轻轻的停顿，提醒你别急着往前冲，先整理步伐。",
      "它带来的不是坏消息，而是一处需要重新校准的提示。",
    ],
    meaningTail: [
      "现在更重要的是看清节奏，而不是逼自己立刻得到结论。",
      "也许先把卡住的那一处松开，很多东西才会重新流动。",
      "先停一下、看一看，往往比继续硬推更有帮助。",
    ],
  },
} as const;

const positionLeadRegistry = {
  insight: [
    "作为这次抽牌的入口，",
    "把目光放回当下时，",
  ],
  past: [
    "回看已经发生的部分，",
    "顺着来路慢慢往回看，",
  ],
  present: [
    "落在“现在”这个位置上，",
    "回到此刻这一格，",
  ],
  guidance: [
    "如果把它当作接下来的提醒，",
    "把它放在“建议”的位置上看，",
  ],
  fallback: [
    "顺着这张牌给出的线索，",
  ],
} as const;

const possibilityFrames = [
  "{positionLead}这张{cardName}{orientationLabel}先把视线带回{topicFocus}。{orientationTone}",
  "{positionLead}{cardName}{orientationLabel}像一束微光，正在把你带回{topicFocus}。{orientationTone}",
  "{positionLead}当{cardName}{orientationLabel}出现时，也许更值得先留意{topicFocus}。{orientationTone}",
] as const;

export type TarotReadingTopic = keyof typeof topicRegistry;

export type TarotInterpretationInput = {
  card: TarotCardDefinition;
  orientation: CardOrientation;
  topic?: TarotReadingTopic;
  spreadId?: TarotSpreadId;
  positionId?: string;
};

export type TarotInterpretation = {
  cardId: string;
  cardName: string;
  orientation: CardOrientation;
  orientationLabel: string;
  topic: TarotReadingTopic;
  topicLabel: string;
  spreadId?: TarotSpreadId;
  position?: TarotSpreadPosition;
  keywords: readonly string[];
  meaning: string;
  possibility: string;
  reflectionQuestion: string;
  gentleAction: string;
};

export function listTarotReadingTopics() {
  return Object.entries(topicRegistry).map(([id, definition]) => ({
    id: id as TarotReadingTopic,
    ...definition,
  }));
}

export function createTarotInterpretation(
  input: TarotInterpretationInput,
): TarotInterpretation {
  const topic = input.topic ?? "general";
  const topicDefinition = topicRegistry[topic];
  const orientationDefinition = orientationRegistry[input.orientation];
  const position = resolveSpreadPosition(input.spreadId, input.positionId);
  const baseMeaning =
    input.orientation === "upright"
      ? input.card.uprightMeaning
      : input.card.reversedMeaning;
  const keywords =
    input.orientation === "upright"
      ? input.card.uprightKeywords
      : input.card.reversedKeywords;
  const signature = createSignature(input.card.id, input.orientation, topic, position?.id);

  const possibility = fillTemplate(pickBySignature(possibilityFrames, signature), {
    positionLead: resolvePositionLead(position, signature),
    cardName: input.card.nameCn,
    orientationLabel: orientationDefinition.label,
    topicFocus: topicDefinition.focus,
    orientationTone: pickBySignature(orientationDefinition.toneLead, `${signature}:tone`),
  });

  const meaning = buildMeaning(
    baseMeaning,
    topicDefinition.label,
    topicDefinition.meaningAngles,
    orientationDefinition.meaningTail,
    position,
    signature,
  );

  const reflectionQuestion = buildReflectionQuestion(
    topicDefinition.label,
    topicDefinition.reflectionArea,
    pickBySignature(input.card.reflectionQuestions, `${signature}:reflection`),
    position,
  );

  const gentleAction = buildGentleAction(
    topicDefinition.label,
    topicDefinition.actionArea,
    pickBySignature(input.card.gentleActions, `${signature}:action`),
    position,
  );

  return {
    cardId: input.card.id,
    cardName: input.card.nameCn,
    orientation: input.orientation,
    orientationLabel: orientationDefinition.label,
    topic,
    topicLabel: topicDefinition.label,
    spreadId: input.spreadId,
    position,
    keywords,
    meaning,
    possibility,
    reflectionQuestion,
    gentleAction,
  };
}

function resolveSpreadPosition(
  spreadId?: TarotSpreadId,
  positionId?: string,
): TarotSpreadPosition | undefined {
  if (!spreadId) {
    return undefined;
  }

  const spread = getTarotSpread(spreadId);

  if (!spread) {
    throw new Error(`Unknown spread id: ${spreadId}`);
  }

  if (!positionId) {
    return spread.positions[0];
  }

  const position = spread.positions.find((item) => item.id === positionId);

  if (!position) {
    throw new Error(`Position "${positionId}" is not defined for spread "${spreadId}".`);
  }

  return position;
}

function resolvePositionLead(
  position: TarotSpreadPosition | undefined,
  signature: string,
): string {
  if (!position) {
    return pickBySignature(positionLeadRegistry.fallback, `${signature}:fallback`);
  }

  const templates =
    positionLeadRegistry[position.id as keyof typeof positionLeadRegistry] ??
    positionLeadRegistry.fallback;

  return pickBySignature(templates, `${signature}:positionLead`);
}

function buildMeaning(
  baseMeaning: string,
  topicLabel: string,
  meaningAngles: readonly string[],
  meaningTail: readonly string[],
  position: TarotSpreadPosition | undefined,
  signature: string,
) {
  const positionPrefix = position
    ? `放在“${position.title}”这个位置上，`
    : "就这次抽牌而言，";
  const angle = pickBySignature(meaningAngles, `${signature}:meaningAngle`);
  const tail = pickBySignature(meaningTail, `${signature}:meaningTail`);

  return `${positionPrefix}${baseMeaning} 在这次关于${topicLabel}的抽牌里，${angle}。${tail}`;
}

function buildReflectionQuestion(
  topicLabel: string,
  reflectionArea: string,
  question: string,
  position: TarotSpreadPosition | undefined,
) {
  if (position) {
    return `如果站在“${position.title}”这个位置回望${topicLabel}，也许值得再问自己一次：${question}`;
  }

  return `围绕${topicLabel}里那个“${reflectionArea}”，也许值得再问自己一次：${question}`;
}

function buildGentleAction(
  topicLabel: string,
  actionArea: string,
  action: string,
  position: TarotSpreadPosition | undefined,
) {
  if (position) {
    return `如果想把“${position.title}”这张牌的提醒带回现实，可以先在${topicLabel}相关的“${actionArea}”里做这一步：${action}`;
  }

  return `如果想把这张牌的提醒带回现实，可以先在${topicLabel}相关的“${actionArea}”里做这一步：${action}`;
}

function createSignature(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(":");
}

function pickBySignature<T>(items: readonly T[], signature: string): T {
  const index = Math.abs(hashText(signature)) % items.length;
  return items[index];
}

function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function hashText(text: string) {
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return hash;
}
