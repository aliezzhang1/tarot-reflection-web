import { useEffect, useState } from "react";
import { TarotCardFigure } from "../components/TarotCardFigure";
import { getTarotSpread } from "../core/tarotSpreads";
import { listTarotReadingTopics } from "../content/tarotInterpretation";
import type { SavedReadingRecord } from "../utils/readingFlow";
import {
  clearReadingHistory,
  deleteReadingRecord,
  readReadingHistory,
} from "../utils/storage";

type ReadingHistoryPageProps = {
  onBackHome: () => void;
  onStartReading: () => void;
};

export function ReadingHistoryPage({ onBackHome, onStartReading }: ReadingHistoryPageProps) {
  const [records, setRecords] = useState<SavedReadingRecord[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const syncRecords = () => {
      const nextRecords = readReadingHistory();
      setRecords(nextRecords);
      setSelectedSeed((currentSeed) => {
        if (currentSeed && nextRecords.some((record) => record.seed === currentSeed)) {
          return currentSeed;
        }

        return nextRecords[0]?.seed ?? null;
      });
    };

    syncRecords();

    if (typeof window === "undefined") {
      return undefined;
    }

    window.addEventListener("storage", syncRecords);

    return () => {
      window.removeEventListener("storage", syncRecords);
    };
  }, []);

  const selectedRecord = records.find((record) => record.seed === selectedSeed) ?? records[0] ?? null;

  const handleOpenRecord = (seed: string) => {
    setSelectedSeed(seed);
    setStatusMessage("已切换到这条记录的详情。你可以继续回看当时的牌面和笔记。");
  };

  const handleDeleteRecord = (seed: string) => {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm("要删除这条本地记录吗？删除后将无法恢复。");

      if (!shouldDelete) {
        return;
      }
    }

    deleteReadingRecord(seed);
    const nextRecords = readReadingHistory();
    setRecords(nextRecords);
    setSelectedSeed((currentSeed) => {
      if (currentSeed && currentSeed !== seed && nextRecords.some((record) => record.seed === currentSeed)) {
        return currentSeed;
      }

      return nextRecords[0]?.seed ?? null;
    });
    setStatusMessage("这条记录已经从当前设备移除。");
  };

  const handleClearAll = () => {
    if (!records.length) {
      return;
    }

    if (typeof window !== "undefined") {
      const shouldClear = window.confirm("要清空全部本地记录吗？这个操作无法恢复。");

      if (!shouldClear) {
        return;
      }
    }

    clearReadingHistory();
    setRecords([]);
    setSelectedSeed(null);
    setStatusMessage("当前设备上的历史记录已经清空。");
  };

  if (!records.length) {
    return (
      <section className="history-shell">
        <div className="history-header">
          <button className="back-link" onClick={onBackHome} type="button">
            返回首页
          </button>
          <p className="section-label">历史记录</p>
          <h2>先完成一次抽牌，历史页才会慢慢长出来</h2>
          <p className="lede">
            当前还没有可回看的本地记录。等你在结果页点击“保存记录”后，这里就会开始积累你的抽牌摘要、笔记和时间线索。
          </p>
        </div>

        <article className="surface-card history-empty">
          <p className="section-label">本地记录</p>
          <h3>还没有保存过任何抽牌结果</h3>
          <p>
            这里的历史记录默认只保存在当前设备上。你可以先完成一次抽牌，再回来回看自己的问题、笔记和当时抓到的线索。
          </p>
          <div className="action-row">
            <button className="primary-button" onClick={onStartReading} type="button">
              去开始一次抽牌
            </button>
            <button className="secondary-button" onClick={onBackHome} type="button">
              返回首页
            </button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="history-shell">
      <div className="history-header">
        <button className="back-link" onClick={onBackHome} type="button">
          返回首页
        </button>
        <p className="section-label">历史记录</p>
        <h2>把过去的抽牌留作回看，而不是反复焦虑</h2>
        <p className="lede">
          这里收的是已经保存到本地的记录。你可以查看详情、删除单条记录，或清空当前设备上的全部历史。
        </p>
      </div>

      <section className="history-toolbar surface-card">
        <div>
          <p className="section-label">当前概览</p>
          <h3>{records.length} 条本地记录</h3>
          <p className="summary-copy">默认按最近保存时间排列，适合回看阶段性的变化和重复出现的主题。</p>
        </div>

        <div className="history-toolbar-actions">
          <button className="secondary-button" onClick={onStartReading} type="button">
            新建一次抽牌
          </button>
          <button className="danger-button" onClick={handleClearAll} type="button">
            一键清空全部记录
          </button>
        </div>
      </section>

      <p className="status-banner" role="status">
        {statusMessage || "提示：历史记录只保存在当前设备，本页不会自动同步到其他端。"}
      </p>

      <section className="history-layout">
        <article className="surface-card history-list-panel">
          <div className="panel-intro compact-panel-intro">
            <p className="section-label">记录列表</p>
            <h3>先选一条，再看细节</h3>
            <p>移动端会按时间顺序上下排列，点开后仍然能清楚看到问题、牌面和笔记。</p>
          </div>

          <div className="history-list" role="list" aria-label="历史记录列表">
            {records.map((record) => {
              const topic = resolveTopicLabel(record.topic);
              const spread = getTarotSpread(record.spreadId);
              const isActive = record.seed === selectedRecord?.seed;
              const notePreview = record.note.trim() || "还没有补充笔记。";

              return (
                <article className={`history-record${isActive ? " is-active" : ""}`} key={record.seed}>
                  <button
                    aria-pressed={isActive}
                    className="history-record-hitarea"
                    onClick={() => handleOpenRecord(record.seed)}
                    type="button"
                  >
                    <div className="history-record-head">
                      <div>
                        <p className="section-label">{topic}</p>
                        <h4>{spread?.name ?? `${record.items.length} 张牌`}</h4>
                      </div>
                      <span className="entry-badge">{formatReadingTime(record.savedAt)}</span>
                    </div>

                    <p className="history-record-question">
                      {record.question || "这次记录保留了开放式提问。"}
                    </p>
                    <p className="history-record-copy">{notePreview}</p>
                  </button>

                  <div className="history-record-actions">
                    <button className="secondary-button history-action-button" onClick={() => handleOpenRecord(record.seed)} type="button">
                      查看详情
                    </button>
                    <button className="danger-button history-action-button" onClick={() => handleDeleteRecord(record.seed)} type="button">
                      删除
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <aside className="surface-card history-detail-panel">
          {selectedRecord ? (
            <>
              <div className="panel-intro compact-panel-intro">
                <p className="section-label">记录详情</p>
                <h3>{resolveTopicLabel(selectedRecord.topic)}</h3>
                <p>
                  {selectedRecord.question || "这次记录以开放式提问开始，更适合回看当时的情绪和关注点。"}
                </p>
              </div>

              <dl className="summary-list">
                <div>
                  <dt>牌阵</dt>
                  <dd>{getTarotSpread(selectedRecord.spreadId)?.name ?? `${selectedRecord.items.length} 张牌`}</dd>
                </div>
                <div>
                  <dt>保存时间</dt>
                  <dd>{formatReadingTime(selectedRecord.savedAt)}</dd>
                </div>
                <div>
                  <dt>原始完成时间</dt>
                  <dd>{formatReadingTime(selectedRecord.createdAt)}</dd>
                </div>
              </dl>

              <section className="history-note-card">
                <p className="section-label">当时的笔记</p>
                <p>{selectedRecord.note.trim() || "这条记录当时还没有写下额外笔记。"}</p>
              </section>

              <div className="history-detail-cards">
                {selectedRecord.items.map((item) => (
                  <article className="reading-card" key={`${selectedRecord.seed}-${item.position.id}-${item.draw.card.id}`}>
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
            </>
          ) : null}
        </aside>
      </section>
    </section>
  );
}

function resolveTopicLabel(topicId: SavedReadingRecord["topic"]) {
  const topic = listTarotReadingTopics().find((item) => item.id === topicId);
  return topic?.label ?? "通用";
}

function formatReadingTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "刚刚";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}