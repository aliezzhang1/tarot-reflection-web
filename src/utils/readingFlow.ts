import { drawTarotCards, type DrawnTarotCard } from "../core/tarotEngine";
import { getTarotSpread, type TarotSpreadId, type TarotSpreadPosition } from "../core/tarotSpreads";
import {
  createTarotInterpretation,
  listTarotReadingTopics,
  type TarotInterpretation,
  type TarotReadingTopic,
} from "../content/tarotInterpretation";
import { majorArcanaDeck, type TarotCardDefinition } from "../content/tarotDeck";

export type ReadingDraft = {
  topic: TarotReadingTopic;
  question: string;
};

export type ReadingResultItem = {
  draw: DrawnTarotCard<TarotCardDefinition>;
  position: TarotSpreadPosition;
  interpretation: TarotInterpretation;
};

export type ReadingResult = {
  topic: TarotReadingTopic;
  question: string;
  spreadId: TarotSpreadId;
  seed: string;
  createdAt: string;
  items: readonly ReadingResultItem[];
};

export type SavedReadingRecord = ReadingResult & {
  note: string;
  savedAt: string;
};

export type ReadingShareCard = {
  title: string;
  subtitle: string;
  reflectionLine: string;
  dateLabel: string;
  cards: readonly {
    label: string;
    cardName: string;
    keywords: readonly string[];
  }[];
  copyText: string;
  fileName: string;
};

export type ReadingShareCardSize = {
  width: number;
  height: number;
};

const SHARE_CARD_WIDTH = 1080;
const SHARE_CARD_HEADER_HEIGHT = 232;
const SHARE_CARD_REFLECTION_HEIGHT = 128;
const SHARE_CARD_FOOTER_HEIGHT = 92;
const SHARE_CARD_ITEM_HEIGHT = 148;

export const dailyDrawDraft: ReadingDraft = {
  topic: "daily-inspiration",
  question: "",
};

type BuildReadingResultOptions = {
  draft: ReadingDraft;
  spreadId: TarotSpreadId;
  seed: string;
  createdAt?: string;
  deck?: readonly TarotCardDefinition[];
};

export function createReadingSeed(draft: ReadingDraft, spreadId: TarotSpreadId) {
  const questionPart = draft.question.trim() || "open-reflection";
  return `${spreadId}:${draft.topic}:${questionPart}:${Date.now()}`;
}

export function createDailyDrawSeed(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `daily-draw:daily-inspiration:${year}-${month}-${day}`;
}

export function buildReadingResult({
  draft,
  spreadId,
  seed,
  createdAt = new Date().toISOString(),
  deck = majorArcanaDeck,
}: BuildReadingResultOptions): ReadingResult {
  const spread = getTarotSpread(spreadId);

  if (!spread) {
    throw new Error(`Unknown spread id: ${spreadId}`);
  }

  const normalizedQuestion = draft.question.trim();
  const drawnCards = drawTarotCards({
    deck,
    count: spread.cardCount,
    seed,
  });

  const items = drawnCards.map((draw, drawIndex) => {
    const position = spread.positions[drawIndex];

    return {
      draw,
      position,
      interpretation: createTarotInterpretation({
        card: draw.card,
        orientation: draw.orientation,
        topic: draft.topic,
        spreadId: spread.id,
        positionId: position.id,
      }),
    };
  });

  return {
    topic: draft.topic,
    question: normalizedQuestion,
    spreadId: spread.id,
    seed,
    createdAt,
    items,
  };
}

export function buildReadingShareCard(result: ReadingResult): ReadingShareCard {
  const spread = getTarotSpread(result.spreadId);
  const topic =
    listTarotReadingTopics().find((item) => item.id === result.topic) ??
    listTarotReadingTopics()[0];
  const spreadLabel = spread?.name ?? `${result.items.length} 张牌`;
  const cards = result.items.map((item) => ({
    label: item.position.title,
    cardName: `${item.draw.card.nameCn} ${item.interpretation.orientationLabel}`,
    keywords: item.interpretation.keywords.slice(0, 3),
  }));
  const title = "塔罗灵感分享卡";
  const subtitle = `${topic.label} · ${spreadLabel}`;
  const reflectionLine = createShareReflectionLine(result);
  const dateLabel = formatShareDate(result.createdAt);
  const copyText = [
    title,
    subtitle,
    `日期：${dateLabel}`,
    ...cards.map((card) => `${card.label}：${card.cardName} · ${card.keywords.join(" / ")}`),
    reflectionLine,
    "默认不包含问题原文、笔记和历史详情，仅保留牌面摘要。",
  ].join("\n");

  return {
    title,
    subtitle,
    reflectionLine,
    dateLabel,
    cards,
    copyText,
    fileName: `tarot-reflection-${result.spreadId}-${dateLabel.replace(/\./g, "-")}.png`,
  };
}

export function getReadingShareCardSize(card: ReadingShareCard): ReadingShareCardSize {
  return {
    width: SHARE_CARD_WIDTH,
    height:
      SHARE_CARD_HEADER_HEIGHT +
      SHARE_CARD_REFLECTION_HEIGHT +
      SHARE_CARD_FOOTER_HEIGHT +
      card.cards.length * SHARE_CARD_ITEM_HEIGHT,
  };
}

export function renderReadingShareCardSvg(card: ReadingShareCard) {
  const size = getReadingShareCardSize(card);
  const reflectionLines = wrapSvgText(card.reflectionLine, 22);

  const cardBlocks = card.cards
    .map((item, index) => {
      const y =
        SHARE_CARD_HEADER_HEIGHT +
        SHARE_CARD_REFLECTION_HEIGHT +
        index * SHARE_CARD_ITEM_HEIGHT;
      const keywords = item.keywords.join(" · ");

      return `
  <g transform="translate(72 ${y})">
    <rect width="936" height="112" rx="26" fill="#FFFDF8" fill-opacity="0.86" stroke="#40574C" stroke-opacity="0.14" />
    <text x="36" y="34" font-size="18" letter-spacing="4" fill="#A06A43">${escapeSvgText(item.label)}</text>
    <text x="36" y="68" font-size="32" font-family="Iowan Old Style, Palatino Linotype, Noto Serif SC, serif" fill="#1F241F">${escapeSvgText(item.cardName)}</text>
    <text x="36" y="96" font-size="22" fill="#5F675E">${escapeSvgText(keywords)}</text>
  </g>`;
    })
    .join("");

  const reflectionTs = reflectionLines
    .map(
      (line, index) =>
        `<tspan x="72" dy="${index === 0 ? 0 : 34}">${escapeSvgText(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="${size.width}" y2="${size.height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F6EFE4" />
      <stop offset="1" stop-color="#ECE1D1" />
    </linearGradient>
    <radialGradient id="ambientLeft" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(164 132) rotate(57.5) scale(214 244)">
      <stop stop-color="#A06A43" stop-opacity="0.24" />
      <stop offset="1" stop-color="#A06A43" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ambientRight" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(886 140) rotate(123.8) scale(204 236)">
      <stop stop-color="#40574C" stop-opacity="0.18" />
      <stop offset="1" stop-color="#40574C" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${size.width}" height="${size.height}" rx="40" fill="url(#paper)" />
  <rect width="${size.width}" height="${size.height}" rx="40" fill="url(#ambientLeft)" />
  <rect width="${size.width}" height="${size.height}" rx="40" fill="url(#ambientRight)" />

  <text x="72" y="78" font-size="18" letter-spacing="4" fill="#A06A43">TAROT REFLECTION</text>
  <text x="72" y="134" font-size="54" font-family="Iowan Old Style, Palatino Linotype, Noto Serif SC, serif" fill="#1F241F">${escapeSvgText(card.title)}</text>
  <text x="72" y="178" font-size="26" fill="#5F675E">${escapeSvgText(card.subtitle)}</text>
  <text x="860" y="178" font-size="24" text-anchor="end" fill="#7A7268">${escapeSvgText(card.dateLabel)}</text>

  <rect x="72" y="204" width="936" height="96" rx="28" fill="#FFFDF8" fill-opacity="0.76" stroke="#A06A43" stroke-opacity="0.16" />
  <text x="72" y="240" font-size="18" letter-spacing="4" fill="#7D4D2C">温和提示</text>
  <text x="72" y="272" font-size="26" fill="#40574C">${reflectionTs}</text>

  ${cardBlocks}

  <text x="72" y="${size.height - 42}" font-size="20" fill="#7A7268">默认不包含问题原文、笔记和历史详情，仅保留牌面摘要。</text>
</svg>`;
}

function createShareReflectionLine(result: ReadingResult) {
  if (result.items.length === 1) {
    return `也许此刻更适合先看见「${result.items[0].draw.card.nameCn}」带出的线索。`;
  }

  return "也许这组牌更适合帮你整理当下，再决定下一步想怎样靠近现实。";
}

function formatShareDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "今天";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function wrapSvgText(text: string, maxCharsPerLine: number) {
  const normalized = text.trim();

  if (!normalized) {
    return ["把这次抽牌当作一组温和线索来看。"];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const char of normalized) {
    currentLine += char;

    if (
      currentLine.length >= maxCharsPerLine &&
      (/[，。？！；：,.!?;:\s]/.test(char) || currentLine.length >= maxCharsPerLine + 6)
    ) {
      lines.push(currentLine.trim());
      currentLine = "";
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.slice(0, 2);
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
