export type DeckSummary = {
  title: string;
  description: string;
};

export type SeedInput = number | string;

export type CardOrientation = "upright" | "reversed";

export type TarotDrawOptions<T> = {
  deck: readonly T[];
  count: number;
  seed?: SeedInput;
};

export type DrawnTarotCard<T> = {
  card: T;
  orientation: CardOrientation;
  drawIndex: number;
  sourceIndex: number;
};

const INITIAL_DECK_SUMMARY: DeckSummary = {
  title: "22 张大阿尔卡纳",
  description:
    "首发版本建议先用 22 张大阿尔卡纳搭建完整体验，再逐步扩展到 78 张完整牌库。",
};

const UINT32_DIVISOR = 4294967296;

export function describeInitialDeck(): DeckSummary {
  return INITIAL_DECK_SUMMARY;
}

export function createSeededRandom(seed: SeedInput): () => number {
  let state = normalizeSeed(seed);

  if (state === 0) {
    state = 0x6d2b79f5;
  }

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let scrambled = state;

    scrambled = Math.imul(scrambled ^ (scrambled >>> 15), scrambled | 1);
    scrambled ^= scrambled + Math.imul(scrambled ^ (scrambled >>> 7), scrambled | 61);

    return ((scrambled ^ (scrambled >>> 14)) >>> 0) / UINT32_DIVISOR;
  };
}

export function shuffleDeck<T>(deck: readonly T[], seed?: SeedInput): T[] {
  ensureDeckHasCards(deck);
  const random = createRandomSource(seed);
  const entries = buildDeckEntries(deck);

  for (let currentIndex = entries.length - 1; currentIndex > 0; currentIndex -= 1) {
    const nextIndex = Math.floor(random() * (currentIndex + 1));
    [entries[currentIndex], entries[nextIndex]] = [entries[nextIndex], entries[currentIndex]];
  }

  return entries.map((entry) => entry.card);
}

export function drawTarotCards<T>({ deck, count, seed }: TarotDrawOptions<T>): DrawnTarotCard<T>[] {
  ensureDrawCount(deck, count);
  const random = createRandomSource(seed);
  const entries = buildDeckEntries(deck);

  for (let currentIndex = entries.length - 1; currentIndex > 0; currentIndex -= 1) {
    const nextIndex = Math.floor(random() * (currentIndex + 1));
    [entries[currentIndex], entries[nextIndex]] = [entries[nextIndex], entries[currentIndex]];
  }

  return entries.slice(0, count).map((entry, drawIndex) => ({
    card: entry.card,
    orientation: random() < 0.5 ? "upright" : "reversed",
    drawIndex,
    sourceIndex: entry.sourceIndex,
  }));
}

function buildDeckEntries<T>(deck: readonly T[]) {
  return deck.map((card, sourceIndex) => ({ card, sourceIndex }));
}

function createRandomSource(seed?: SeedInput) {
  return seed === undefined ? Math.random : createSeededRandom(seed);
}

function ensureDeckHasCards<T>(deck: readonly T[]) {
  if (deck.length === 0) {
    throw new Error("Deck must contain at least one card.");
  }
}

function ensureDrawCount<T>(deck: readonly T[], count: number) {
  ensureDeckHasCards(deck);

  if (!Number.isInteger(count) || count < 1) {
    throw new Error("Draw count must be a positive integer.");
  }

  if (count > deck.length) {
    throw new Error("Draw count cannot exceed deck size.");
  }
}

function normalizeSeed(seed: SeedInput): number {
  const seedText = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < seedText.length; index += 1) {
    hash ^= seedText.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}