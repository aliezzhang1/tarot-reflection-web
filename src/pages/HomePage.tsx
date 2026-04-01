import { useState } from "react";
import { DisclaimerDialog } from "../components/DisclaimerDialog";
import { productCopy } from "../content/siteCopy";
import { readReadingHistory, readTodayDailyDrawStatus } from "../utils/storage";

const trustNotes = [
  "仅供娱乐与思绪整理参考",
  "不提供医疗、法律、金融建议",
];

type HomePageProps = {
  hasAcknowledgedDisclaimer: boolean;
  onAcknowledgeDisclaimer: () => void;
};

type QuickEntry = {
  id: string;
  label: string;
  title: string;
  description: string;
  action: string;
  meta: string;
  href?: string;
  type: "link" | "button";
};

export function HomePage({
  hasAcknowledgedDisclaimer,
  onAcknowledgeDisclaimer,
}: HomePageProps) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const historyCount = readReadingHistory().length;
  const dailyDrawStatus = readTodayDailyDrawStatus();

  const quickEntries: QuickEntry[] = [
    {
      id: "daily-draw-entry",
      label: "每日一抽",
      title: "用一张牌照见今天的情绪天气",
      description:
        "适合在一天开始前或结束后快速抽一张牌，给自己一个更柔和的观察角度。",
      action: dailyDrawStatus === "idle" ? "打开每日一抽" : "回看今日一抽",
      meta: resolveDailyDrawMeta(dailyDrawStatus),
      href: "#daily-draw",
      type: "link",
    },
    {
      id: "history-entry",
      label: "历史记录",
      title: "回看你曾经问过的问题与感受",
      description:
        "这里会汇总已经保存到本地的抽牌结果和笔记，方便复盘，而不是重复焦虑。",
      action: "查看历史记录",
      meta: historyCount ? `${historyCount} 条记录` : "本地存储",
      href: "#history",
      type: "link",
    },
    {
      id: "notice-entry",
      label: "免责声明",
      title: "先说清边界，再进入抽牌",
      description:
        "页面定位是塔罗灵感与思绪整理工具，重点是陪你整理想法，而不是替你做高风险决定。",
      action: "打开正式说明",
      meta: hasAcknowledgedDisclaimer ? "已确认" : "建议先看",
      type: "button",
    },
  ];

  const primaryEntries = quickEntries.filter((entry) => entry.id !== "notice-entry");
  const disclaimerEntry = quickEntries.find((entry) => entry.id === "notice-entry");

  const renderEntryCard = (entry: QuickEntry, extraClassName?: string) => (
    <article
      className={`surface-card entry-card${extraClassName ? ` ${extraClassName}` : ""}`}
      id={entry.id}
      key={`${entry.id}-${extraClassName ?? "default"}`}
    >
      <div className="entry-head">
        <p className="section-label">{entry.label}</p>
        <span className="entry-badge">{entry.meta}</span>
      </div>
      <h3>{entry.title}</h3>
      <p className="entry-description entry-description-desktop">{entry.description}</p>
      {entry.type === "button" ? (
        <button
          className="entry-link entry-link-button"
          onClick={() => setIsDisclaimerOpen(true)}
          type="button"
        >
          {entry.action}
        </button>
      ) : (
        <a className="entry-link" href={entry.href}>
          {entry.action}
        </a>
      )}
    </article>
  );

  return (
    <>
      <section className="home-grid">
        <section className="surface-card landing-hero">
          <div className="hero-copy">
            <p className="section-label">塔罗灵感 / 思绪整理工具</p>
            <h2 className="hero-mobile-title">{productCopy.heroTitle}</h2>
            <h2 className="hero-desktop-title">
              <span className="hero-title-line">把问题放轻一点</span>
              <span className="hero-title-line">再抽一张牌</span>
            </h2>
            <p className="lede">{productCopy.heroDescription}</p>

            <div className="action-row">
              <a className="primary-button" href="#setup">
                开始抽牌
              </a>
              <a className="secondary-button" href="#daily-draw">
                每日一抽
              </a>
            </div>

            <p className="hero-start-hint">
              带着一个明确问题进入准备页，或者先用每日一抽开始，把一次抽牌控制在几分钟里完成。
            </p>

            <ul className="trust-notes trust-notes-desktop" aria-label="使用边界说明">
              {trustNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <aside className="hero-side">
            <p className="section-label">入口概览</p>

            <div className="hero-side-block">
              <span className="mini-label">开始方式</span>
              <strong>单张灵感 / 每日一抽 / 历史回看</strong>
              <p>
                先把一次抽牌控制在几分钟内完成，再慢慢补齐问题输入、牌阵和结果记录，不做神秘化堆砌。
              </p>
            </div>

            <div className="hero-side-block">
              <span className="mini-label">当前状态</span>
              <strong>
                {hasAcknowledgedDisclaimer ? "免责声明已确认" : "首次使用建议先阅读正式说明"}
              </strong>
              <p>
                现在已经可以从首页进入主题选择页、每日一抽和历史记录页，后续会继续补齐更完整的牌库与交互。
              </p>
            </div>
          </aside>
        </section>

        <section className="entry-grid" aria-label="首页快捷入口">
          {primaryEntries.map((entry) => renderEntryCard(entry))}
          {disclaimerEntry ? renderEntryCard(disclaimerEntry, "desktop-disclaimer-card") : null}
        </section>

        <section className="home-columns">
          <article className="surface-card info-card">
            <p className="section-label">你会得到什么</p>
            <h3>不是结论，而是一个更清晰的切入口</h3>
            <ul className="bullet-list compact-list">
              <li>用一张牌或三张牌，把注意力从混乱感受收回到可描述的线索。</li>
              <li>把“可能性描述 + 反思问题 + 温和行动”变成一次短而完整的自我对话。</li>
              <li>通过历史记录回看自己，而不是把抽牌结果当成命令。</li>
            </ul>
          </article>

          <article className="surface-card info-card">
            <p className="section-label">本地保存与隐私</p>
            <h3>记录默认留在当前设备里</h3>
            <p>
              这个项目目前不接后端、数据库或账号系统。你保存的抽牌结果、笔记和每日一抽状态默认只写在本地，更适合先安静使用，再决定要不要回看。
            </p>
            <div className="info-card-actions">
              <a className="secondary-button" href={historyCount ? "#history" : "#setup"}>
                {historyCount ? "查看本地记录" : "开始第一次抽牌"}
              </a>
              <p className="notice-status">
                当前状态：
                <strong>{historyCount ? ` 已保存 ${historyCount} 条本地记录` : " 还没有保存记录"}</strong>
              </p>
            </div>
          </article>
        </section>

        {disclaimerEntry ? renderEntryCard(disclaimerEntry, "mobile-disclaimer-card") : null}
      </section>

      <DisclaimerDialog
        isAcknowledged={hasAcknowledgedDisclaimer}
        isOpen={isDisclaimerOpen}
        onAcknowledge={() => {
          onAcknowledgeDisclaimer();
          setIsDisclaimerOpen(false);
        }}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </>
  );
}

function resolveDailyDrawMeta(status: ReturnType<typeof readTodayDailyDrawStatus>) {
  if (status === "saved") {
    return "今日已抽";
  }

  if (status === "drawn") {
    return "今日已抽";
  }

  return "单张抽牌";
}
