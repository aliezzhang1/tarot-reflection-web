import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DeckPreview, type DeckPreviewPhase } from "../components/DeckPreview";
import {
  buildReadingResult,
  createDailyDrawSeed,
  dailyDrawDraft,
  type ReadingResult,
} from "../utils/readingFlow";
import { markDailyDrawDrawn, readTodayDailyDrawStatus } from "../utils/storage";

type DailyDrawPageProps = {
  onOpenCustomReading: () => void;
  onComplete: (result: ReadingResult) => void;
};

export function DailyDrawPage({
  onOpenCustomReading,
  onComplete,
}: DailyDrawPageProps) {
  const [drawPhase, setDrawPhase] = useState<DeckPreviewPhase>("idle");
  const timersRef = useRef<number[]>([]);
  const todayLabel = formatDailyDrawDate(new Date());
  const todayStatus = readTodayDailyDrawStatus();
  const stageDescription = resolveDailyDrawDescription(drawPhase);

  useEffect(() => {
    return () => {
      clearTimers(timersRef.current);
    };
  }, []);

  const handleDailyDraw = () => {
    if (drawPhase !== "idle") {
      return;
    }

    clearTimers(timersRef.current);

    const seed = createDailyDrawSeed();
    setDrawPhase("centering");

    timersRef.current = [
      window.setTimeout(() => {
        setDrawPhase("shuffling");
      }, 300),
      window.setTimeout(() => {
        const nextResult = buildReadingResult({
          draft: dailyDrawDraft,
          spreadId: "single-card",
          seed,
        });

        markDailyDrawDrawn();
        setDrawPhase("idle");
        onComplete(nextResult);
      }, 1200),
    ];
  };

  return (
    <section className="daily-draw-shell ritual-page">
      <div className="daily-draw-header ritual-enter" style={buildDelayStyle(0.04)}>
        <p className="section-label">每日一抽</p>
                <h2>翻开一张牌，给自己留一点安静</h2>

        <div className="daily-draw-meta">
          <p className="daily-draw-date">{todayLabel}</p>
          <span className="entry-badge">{resolveDailyStatusLabel(todayStatus)}</span>
        </div>
      </div>

      <section className="surface-card draw-stage-card daily-draw-stage ritual-enter" style={buildDelayStyle(0.12)}>
        <div className="draw-stage-stack">
          <p className="section-label">今日抽牌</p>

          <DeckPreview cardCount={1} phase={drawPhase} />

          <div className="draw-stage-steps" aria-hidden="true">
            <span className={`stage-step${drawPhase === "centering" || drawPhase === "shuffling" ? " is-active" : ""}`}>
              收拢注意力
            </span>
            <span className={`stage-step${drawPhase === "shuffling" ? " is-active" : ""}`}>
              轻量洗牌
            </span>
          </div>

          <div className="draw-stage-copy-simple">
            <h3>{resolveDailyDrawTitle(drawPhase)}</h3>
            {stageDescription && <p>{stageDescription}</p>}
          </div>

          <div className="draw-actions draw-actions-simple daily-draw-actions-compact">
            <button className="primary-button" disabled={drawPhase !== "idle"} onClick={handleDailyDraw} type="button">
              {drawPhase === "idle" ? "开始今日一抽" : "正在进入抽牌状态..."}
            </button>
            <button className="secondary-button" onClick={onOpenCustomReading} type="button">
              改用自定义抽牌
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

function buildDelayStyle(delay: number): CSSProperties {
  return {
    "--enter-delay": `${delay}s`,
  } as CSSProperties;
}

function clearTimers(timers: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  timers.forEach((timer) => window.clearTimeout(timer));
  timers.length = 0;
}

function resolveDailyStatusLabel(status: ReturnType<typeof readTodayDailyDrawStatus>) {
  if (status === "saved") {
    return "今日已翻开";
  }

  if (status === "drawn") {
    return "今日已翻开";
  }

  return "默认单张牌";
}

function resolveDailyDrawTitle(phase: DeckPreviewPhase) {
  if (phase === "centering") {
    return "先给今天留一个很短的停顿";
  }

  if (phase === "shuffling") {
    return "正在为今天翻开一张牌";
  }

  return "准备好就开始今日一抽";
}

function resolveDailyDrawDescription(phase: DeckPreviewPhase) {
  if (phase === "centering") {
    return "页面会先短暂停一下，让注意力慢慢收回来，再进入轻量洗牌。这个停顿只是帮助你切换状态。";
  }

  if (phase === "shuffling") {
    return "卡牌会做一段简短而克制的过渡，然后直接带你进入结果页。";
  }

  return "";
}

function formatDailyDrawDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}








