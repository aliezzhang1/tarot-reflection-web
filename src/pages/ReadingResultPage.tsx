import { useEffect, useState, type CSSProperties } from "react";
import { ShareCardConfirmDialog } from "../components/ShareCardConfirmDialog";
import { TarotCardFigure } from "../components/TarotCardFigure";
import { getTarotSpread } from "../core/tarotSpreads";
import { listTarotReadingTopics } from "../content/tarotInterpretation";
import {
  buildReadingShareCard,
  getReadingShareCardSize,
  renderReadingShareCardSvg,
  type ReadingResult,
  type ReadingShareCard,
} from "../utils/readingFlow";
import { renderSvgMarkupToPngBlob } from "../utils/shareCardExport";
import { getSavedReadingRecord, saveReadingRecord } from "../utils/storage";

type ReadingResultPageProps = {
  result: ReadingResult | null;
  onBackToSetup: () => void;
  onBackHome: () => void;
  bottomPrimaryLabel?: string;
};

const noteMaxLength = 280;

export function ReadingResultPage({
  result,
  onBackToSetup,
  onBackHome,
  bottomPrimaryLabel = "返回准备页调整问题",
}: ReadingResultPageProps) {
  const [note, setNote] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [shareCard, setShareCard] = useState<ReadingShareCard | null>(null);
  const [shareCardUrl, setShareCardUrl] = useState("");
  const [isShareConfirmOpen, setIsShareConfirmOpen] = useState(false);
  const [isGeneratingShareCard, setIsGeneratingShareCard] = useState(false);

  useEffect(() => {
    if (!result) {
      setNote("");
      setStatusMessage("");
      setShareCard(null);
      setIsShareConfirmOpen(false);
      setIsGeneratingShareCard(false);
      setShareCardUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return "";
      });
      return;
    }

    const savedRecord = getSavedReadingRecord(result.seed);
    setNote(savedRecord?.note ?? "");
    setShareCard(null);
    setIsShareConfirmOpen(false);
    setIsGeneratingShareCard(false);
    setShareCardUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return "";
    });
    setStatusMessage(
      savedRecord?.note
        ? "已经为你恢复当前设备上的本地笔记。"
        : "你可以先写下当下感受，再决定是否保存到本地记录。",
    );
  }, [result]);

  useEffect(() => {
    return () => {
      if (shareCardUrl) {
        URL.revokeObjectURL(shareCardUrl);
      }
    };
  }, [shareCardUrl]);

  if (!result) {
    return (
      <section className="result-shell ritual-page">
        <article className="surface-card result-empty ritual-enter" style={buildDelayStyle(0.06)}>
          <p className="section-label">结果页</p>
          <h2>还没有可展示的抽牌结果</h2>
          <p className="lede">
            你可以先回到准备页，选一个主题并完成一次抽牌。之后这里会展示牌面、关键词和可保存的本地笔记。
          </p>
          <div className="action-row">
            <button className="primary-button" onClick={onBackToSetup} type="button">
              回到准备页
            </button>
            <button className="secondary-button" onClick={onBackHome} type="button">
              返回首页
            </button>
          </div>
        </article>
      </section>
    );
  }

  const topic =
    listTarotReadingTopics().find((item) => item.id === result.topic) ??
    listTarotReadingTopics()[0];
  const spread = getTarotSpread(result.spreadId);
  const createdAtLabel = formatReadingTime(result.createdAt);

  const handleSaveRecord = () => {
    saveReadingRecord({
      ...result,
      note: note.trim(),
      savedAt: new Date().toISOString(),
    });

    setStatusMessage(
      note.trim()
        ? "这次抽牌和笔记已经保存到当前设备。"
        : "这次抽牌已经保存到当前设备，你之后也可以再补笔记。",
    );
  };

  const handleConfirmGenerateShareCard = async () => {
    setIsShareConfirmOpen(false);
    setIsGeneratingShareCard(true);
    setStatusMessage("正在当前设备本地生成 PNG 分享卡片...");

    try {
      const nextShareCard = buildReadingShareCard(result);
      const nextSvg = renderReadingShareCardSvg(nextShareCard);
      const nextPngBlob = await renderSvgMarkupToPngBlob(
        nextSvg,
        getReadingShareCardSize(nextShareCard),
      );
      const nextUrl = URL.createObjectURL(nextPngBlob);

      setShareCardUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return nextUrl;
      });
      setShareCard(nextShareCard);

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        try {
          await navigator.clipboard.writeText(nextShareCard.copyText);
          setStatusMessage("PNG 分享卡片已在当前设备本地生成，降敏文案也已复制到剪贴板。");
          return;
        } catch {
          // Ignore clipboard errors and still show the preview.
        }
      }

      setStatusMessage("PNG 分享卡片已在当前设备本地生成。");
    } catch {
      setStatusMessage("这次没有成功生成 PNG 分享卡片，请稍后再试。");
    } finally {
      setIsGeneratingShareCard(false);
    }
  };

  const handleDownloadShareCard = () => {
    if (!shareCardUrl || !shareCard) {
      return;
    }

    const link = document.createElement("a");
    link.href = shareCardUrl;
    link.download = shareCard.fileName;
    link.click();
  };

  return (
    <section className="result-shell ritual-page">
      <div className="result-header ritual-enter" style={buildDelayStyle(0.04)}>
        <p className="section-label">结果页</p>
        <h2>把这次抽牌当作一组温和线索来看</h2>
        <p className="lede">
          这里给出的不是确定结论，而是一组围绕当下状态展开的提示。你可以先看见它，再决定哪些部分值得带回现实里慢慢验证。
        </p>
      </div>

      <section className="surface-card result-list-card ritual-enter" style={buildDelayStyle(0.1)}>
        <div className="reading-card-grid">
          {result.items.map((item, index) => (
            <article
              className="reading-card ritual-enter"
              key={`${item.position.id}-${item.draw.card.id}`}
              style={buildDelayStyle(0.16 + index * 0.08)}
            >
              <div className="reading-card-visual">
                <TarotCardFigure card={item.draw.card} orientation={item.draw.orientation} />
              </div>

              <div className="reading-card-content">
                <div className="card-heading">
                  <p className="section-label">{item.position.title}</p>
                  <h3>{item.draw.card.nameCn}</h3>
                  <p className="result-meta">
                    {item.interpretation.orientationLabel} · {item.draw.card.nameEn}
                  </p>
                  <p className="position-copy">{item.position.description}</p>
                </div>

                <ul className="keyword-list" aria-label={`${item.draw.card.nameCn}关键词`}>
                  {item.interpretation.keywords.map((keyword) => (
                    <li className="keyword-chip" key={keyword}>
                      {keyword}
                    </li>
                  ))}
                </ul>

                <p className="reading-possibility">{item.interpretation.possibility}</p>

                <dl className="detail-list">
                  <div>
                    <dt>含义说明</dt>
                    <dd>{item.interpretation.meaning}</dd>
                  </div>
                  <div>
                    <dt>反思问题</dt>
                    <dd className="reflection-quote">{item.interpretation.reflectionQuestion}</dd>
                  </div>
                  <div>
                    <dt>低风险行动建议</dt>
                    <dd>{item.interpretation.gentleAction}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="result-columns">
        <article className="surface-card result-summary ritual-enter" style={buildDelayStyle(0.32)}>
          <p className="section-label">本次概览</p>
          <h3>{spread?.name ?? "抽牌结果"}</h3>
          <p className="summary-copy">{topic.label}</p>

          <dl className="summary-list">
            <div>
              <dt>主题</dt>
              <dd>{topic.label}</dd>
            </div>
            <div>
              <dt>问题</dt>
              <dd>{result.question || "这次你选择保留开放式提问。"}</dd>
            </div>
            <div>
              <dt>完成时间</dt>
              <dd>{createdAtLabel}</dd>
            </div>
            <div>
              <dt>抽牌数量</dt>
              <dd>{result.items.length} 张</dd>
            </div>
          </dl>
        </article>

        <aside className="surface-card journal-panel ritual-enter" style={buildDelayStyle(0.38)}>
          <div className="panel-intro compact-panel-intro">
            <p className="section-label">写笔记</p>
            <h3>把此刻想到的话先留下来</h3>
            <p>
              你可以记下最有共鸣的一点、还没想清楚的地方，或者一个准备慢慢观察的小动作。这里的笔记只会保存在当前设备上。
            </p>
          </div>

          <label className="field-shell notes-shell">
            <span className="field-label">我的笔记</span>
            <textarea
              className="notes-input"
              maxLength={noteMaxLength}
              onChange={(event) => setNote(event.target.value)}
              placeholder="例如：哪一张牌最触动我？我想先观察什么变化？"
              rows={6}
              value={note}
            />
            <div className="notes-meta">
              <p className="helper-note">默认只保存在本地，不会自动分享出去。</p>
              <span className="char-counter">{note.length}/{noteMaxLength}</span>
            </div>
          </label>

          <div className="notes-actions">
            <button className="primary-button" onClick={handleSaveRecord} type="button">
              保存记录
            </button>
            <button
              className="secondary-button"
              disabled={isGeneratingShareCard}
              onClick={() => setIsShareConfirmOpen(true)}
              type="button"
            >
              {isGeneratingShareCard ? "正在生成 PNG..." : "生成分享卡片"}
            </button>
          </div>

          <p className="status-banner" role="status">
            {statusMessage}
          </p>
        </aside>
      </section>

      {shareCard && (
        <section className="surface-card share-preview ritual-enter" style={buildDelayStyle(0.08)}>
          <div className="share-preview-header">
            <p className="section-label">分享卡片预览</p>
            <h3>{shareCard.title}</h3>
            <p className="share-preview-copy">{shareCard.subtitle}</p>
          </div>

          {shareCardUrl && (
            <div className="share-image-frame">
              <img alt={`${shareCard.title} PNG 预览`} className="share-image" src={shareCardUrl} />
            </div>
          )}

          <div className="share-preview-meta">
            <p className="share-preview-copy">日期：{shareCard.dateLabel}</p>
            <p className="share-disclaimer">{shareCard.reflectionLine}</p>
          </div>

          <ul className="share-preview-list">
            {shareCard.cards.map((item) => (
              <li className="share-preview-item" key={`${item.label}-${item.cardName}`}>
                {item.label}：{item.cardName} · {item.keywords.join(" / ")}
              </li>
            ))}
          </ul>

          <p className="share-disclaimer">
            这张分享卡片默认只带牌面摘要，不包含你的问题原文、笔记内容或历史记录详情。
          </p>

          <div className="notes-actions">
            <button className="secondary-button" onClick={handleDownloadShareCard} type="button">
              下载 PNG 卡片
            </button>
          </div>
        </section>
      )}

      <div className="result-actions ritual-enter" style={buildDelayStyle(0.24)}>
        <button className="primary-button" onClick={onBackToSetup} type="button">
          {bottomPrimaryLabel}
        </button>
        <button className="secondary-button" onClick={onBackHome} type="button">
          返回首页
        </button>
      </div>

      <ShareCardConfirmDialog
        isOpen={isShareConfirmOpen}
        onCancel={() => setIsShareConfirmOpen(false)}
        onConfirm={handleConfirmGenerateShareCard}
      />
    </section>
  );
}

function buildDelayStyle(delay: number): CSSProperties {
  return {
    "--enter-delay": `${delay}s`,
  } as CSSProperties;
}

function formatReadingTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "刚刚完成";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}