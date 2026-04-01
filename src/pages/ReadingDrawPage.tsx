import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DeckPreview, type DeckPreviewPhase } from "../components/DeckPreview";
import { listTarotReadingTopics } from "../content/tarotInterpretation";
import { getTarotSpread, type TarotSpreadId } from "../core/tarotSpreads";
import {
  buildReadingResult,
  createReadingSeed,
  type ReadingDraft,
  type ReadingResult,
} from "../utils/readingFlow";

type ReadingDrawPageProps = {
  draft: ReadingDraft;
  selectedSpreadId: TarotSpreadId;
  onBack: () => void;
  onComplete: (result: ReadingResult) => void;
};

export function ReadingDrawPage({
  draft,
  selectedSpreadId,
  onBack,
  onComplete,
}: ReadingDrawPageProps) {
  const [drawPhase, setDrawPhase] = useState<DeckPreviewPhase>("idle");
  const timersRef = useRef<number[]>([]);

  const currentTopic =
    listTarotReadingTopics().find((topic) => topic.id === draft.topic) ??
    listTarotReadingTopics()[0];
  const spread = getTarotSpread(selectedSpreadId)!;
  const normalizedQuestion = draft.question.trim();
  const stageDescription = resolveDrawStageDescription(drawPhase);

  useEffect(() => {
    return () => {
      clearTimers(timersRef.current);
    };
  }, []);

  const handleDraw = () => {
    if (drawPhase !== "idle") {
      return;
    }

    clearTimers(timersRef.current);

    const seed = createReadingSeed(draft, selectedSpreadId);
    setDrawPhase("centering");

    timersRef.current = [
      window.setTimeout(() => {
        setDrawPhase("shuffling");
      }, 360),
      window.setTimeout(() => {
        const nextResult = buildReadingResult({
          draft,
          spreadId: selectedSpreadId,
          seed,
        });

        setDrawPhase("idle");
        onComplete(nextResult);
      }, 1320),
    ];
  };

  return (
    <section className="draw-shell ritual-page">
      <div className="draw-header ritual-enter" style={buildDelayStyle(0.04)}>
        <p className="section-label">洗牌与抽牌</p>
        <h2>准备好就开始抽牌</h2>
        <p className="lede">
          你已经选好了抽牌模式、主题和问题。接下来只需要让页面短暂停一下，再进入轻量洗牌和结果页。
        </p>
      </div>

      <section className="draw-columns">
        <article className="surface-card draw-panel ritual-enter" style={buildDelayStyle(0.1)}>
          <p className="section-label">本次牌阵</p>
          <h3>{spread.name}</h3>
          <p className="summary-copy">{spread.description}</p>

          <dl className="summary-list draw-info-list">
            <div>
              <dt>牌张数量</dt>
              <dd>{spread.cardCount} 张牌</dd>
            </div>
            <div>
              <dt>位置结构</dt>
              <dd>{spread.positions.map((position) => position.title).join(" / ")}</dd>
            </div>
            <div>
              <dt>调整方式</dt>
              <dd>如果想换成另一种抽法，可以返回上一页修改。</dd>
            </div>
          </dl>
        </article>

        <aside className="surface-card draw-summary ritual-enter" style={buildDelayStyle(0.16)}>
          <p className="section-label">当前问题</p>
          <h3>{currentTopic.label}</h3>
          <p className="summary-copy">{currentTopic.focus}</p>

          <dl className="summary-list draw-info-list">
            <div>
              <dt>已选主题</dt>
              <dd>{currentTopic.label}</dd>
            </div>
            <div>
              <dt>问题</dt>
              <dd>{normalizedQuestion || "你这次选择保留开放空间，让抽牌从当下感受开始。"}</dd>
            </div>
            <div>
              <dt>抽牌模式</dt>
              <dd>{spread.name}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="surface-card draw-stage-card ritual-enter" style={buildDelayStyle(0.22)}>
        <div className="draw-stage-stack">
          <p className="section-label">洗牌与抽牌</p>

          <DeckPreview cardCount={spread.cardCount} phase={drawPhase} />

          <div className="draw-stage-steps" aria-hidden="true">
            <span className={`stage-step${drawPhase === "centering" || drawPhase === "shuffling" ? " is-active" : ""}`}>
              收拢注意力
            </span>
            <span className={`stage-step${drawPhase === "shuffling" ? " is-active" : ""}`}>
              轻量洗牌
            </span>
          </div>

          <div className="draw-stage-copy-simple">
            <h3>{resolveDrawStageTitle(drawPhase)}</h3>
            {stageDescription && <p>{stageDescription}</p>}
          </div>

          <div className="draw-actions draw-actions-simple">
            <button className="primary-button" disabled={drawPhase !== "idle"} onClick={handleDraw} type="button">
              {drawPhase === "idle" ? `开始${spread.shortLabel}抽牌` : "正在进入抽牌状态..."}
            </button>
          </div>
        </div>
      </section>

      <div className="draw-footer-nav ritual-enter" style={buildDelayStyle(0.28)}>
        <button className="secondary-button" onClick={onBack} type="button">
          返回上一页
        </button>
      </div>
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

function resolveDrawStageTitle(phase: DeckPreviewPhase) {
  if (phase === "centering") {
    return "先给这次抽牌留一个安静的停顿";
  }

  if (phase === "shuffling") {
    return "正在轻轻洗牌，请稍等片刻";
  }

  return "准备好就开始抽牌";
}

function resolveDrawStageDescription(phase: DeckPreviewPhase) {
  if (phase === "centering") {
    return "页面会先短暂停一下，让注意力慢慢收回来，再进入轻量洗牌。这个过渡只是帮助你聚焦，不是在制造神秘感。";
  }

  if (phase === "shuffling") {
    return "卡牌会做一段简短而克制的洗牌过渡，然后直接带你进入结果页。";
  }

  return "";
}
