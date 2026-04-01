import { createDailyDrawSeed, type SavedReadingRecord } from "./readingFlow";

const READING_HISTORY_STORAGE_KEY = "tarot-reflection:reading-history";
const DAILY_DRAW_MARKER_PREFIX = "tarot-reflection:daily-draw-drawn:";
const DISCLAIMER_ACK_STORAGE_KEY = "tarot-reflection:disclaimer-acknowledged";
const LEGACY_NOTICE_ACK_KEY = "tarot_notice_acknowledged";

export type DailyDrawStatus = "idle" | "drawn" | "saved";

export function readLocalFlag(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(key) === "true";
}

export function writeLocalFlag(key: string, value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, String(value));
}

export function hasAcknowledgedDisclaimer() {
  return readLocalFlag(DISCLAIMER_ACK_STORAGE_KEY) || readLocalFlag(LEGACY_NOTICE_ACK_KEY);
}

export function acknowledgeDisclaimer() {
  writeLocalFlag(DISCLAIMER_ACK_STORAGE_KEY, true);
  writeLocalFlag(LEGACY_NOTICE_ACK_KEY, true);
}

export function readReadingHistory(): SavedReadingRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(READING_HISTORY_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isSavedReadingRecord);
  } catch {
    return [];
  }
}

export function getSavedReadingRecord(seed: string): SavedReadingRecord | undefined {
  return readReadingHistory().find((item) => item.seed === seed);
}

export function saveReadingRecord(record: SavedReadingRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const history = readReadingHistory().filter((item) => item.seed !== record.seed);
  const nextHistory = [record, ...history];

  writeReadingHistory(nextHistory);
}

export function deleteReadingRecord(seed: string) {
  if (typeof window === "undefined") {
    return;
  }

  const nextHistory = readReadingHistory().filter((item) => item.seed !== seed);
  writeReadingHistory(nextHistory);
}

export function clearReadingHistory() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(READING_HISTORY_STORAGE_KEY);
}

export function markDailyDrawDrawn(date: Date = new Date()) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getDailyDrawMarkerKey(date), "true");
}

export function readTodayDailyDrawStatus(date: Date = new Date()): DailyDrawStatus {
  if (getSavedReadingRecord(createDailyDrawSeed(date))) {
    return "saved";
  }

  if (typeof window === "undefined") {
    return "idle";
  }

  return window.localStorage.getItem(getDailyDrawMarkerKey(date)) === "true" ? "drawn" : "idle";
}

function writeReadingHistory(history: SavedReadingRecord[]) {
  window.localStorage.setItem(READING_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function getDailyDrawMarkerKey(date: Date) {
  return `${DAILY_DRAW_MARKER_PREFIX}${formatLocalDateKey(date)}`;
}

function formatLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSavedReadingRecord(value: unknown): value is SavedReadingRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SavedReadingRecord>;

  return (
    typeof candidate.seed === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.savedAt === "string" &&
    typeof candidate.note === "string" &&
    Array.isArray(candidate.items)
  );
}