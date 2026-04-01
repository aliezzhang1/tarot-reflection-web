import { useState } from "react";
import { DisclaimerDialog } from "../components/DisclaimerDialog";
import { QuestionField } from "../components/QuestionField";
import { SpreadPicker } from "../components/SpreadPicker";
import { TopicPicker } from "../components/TopicPicker";
import { assessHighRiskQuestion, getHighRiskTypeLabel } from "../core/riskGuard";
import {
  getTarotSpread,
  listTarotSpreads,
  type TarotSpreadId,
} from "../core/tarotSpreads";
import {
  listTarotReadingTopics,
  type TarotReadingTopic,
} from "../content/tarotInterpretation";

type ReadingSetupPageProps = {
  hasAcknowledgedDisclaimer: boolean;
  selectedSpreadId: TarotSpreadId;
  selectedTopic: TarotReadingTopic;
  question: string;
  onAcknowledgeDisclaimer: () => void;
  onSpreadChange: (spreadId: TarotSpreadId) => void;
  onTopicChange: (topic: TarotReadingTopic) => void;
  onQuestionChange: (question: string) => void;
  onContinue: () => void;
};

const selectableTopics = listTarotReadingTopics().filter(
  (topic) => topic.id !== "general",
);
const availableSpreads = listTarotSpreads().filter(
  (spread) => spread.id === "single-card" || spread.id === "past-present-guidance",
);

const questionPlaceholders: Record<TarotReadingTopic, string> = {
  general: "我现在最需要看见的是什么？",
  love: "我该如何面对这段感情里的迟疑？",
  relationship: "我该怎样理解这段关系目前的距离感？",
  career: "我现在最值得投入精力的工作方向是什么？",
  study: "我该怎样调整最近的学习节奏？",
  "daily-inspiration": "今天有什么值得我留意的小提醒？",
};

export function ReadingSetupPage({
  hasAcknowledgedDisclaimer,
  selectedSpreadId,
  selectedTopic,
  question,
  onAcknowledgeDisclaimer,
  onSpreadChange,
  onTopicChange,
  onQuestionChange,
  onContinue,
}: ReadingSetupPageProps) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const currentTopic =
    selectableTopics.find((topic) => topic.id === selectedTopic) ?? selectableTopics[0];
  const selectedSpread = getTarotSpread(selectedSpreadId) ?? availableSpreads[0];
  const draftQuestion = question.trim();
  const riskAssessment = assessHighRiskQuestion(draftQuestion);

  const handleContinue = () => {
    if (riskAssessment.shouldBlock) {
      return;
    }

    onContinue();
  };

  return (
    <section className="setup-shell">
      <p className="setup-page-note">
        这里更适合整理思绪，而不是预测未来。先选抽牌模式，再选主题和一句简短问题，确认后就直接进入抽牌。
      </p>

      <section className="surface-card topic-panel">
        <div className="panel-intro compact-panel-intro">
          <p className="section-label">抽牌模式</p>
          <h3>先选 1 张牌还是 3 张牌</h3>
          <p>
            单张牌适合快速聚焦，三张牌更适合理清脉络。你先在这里决定抽法，下一页会直接进入轻量洗牌和正式抽牌。
          </p>
        </div>

        <SpreadPicker
          onSelect={onSpreadChange}
          selectedSpreadId={selectedSpreadId}
          spreads={availableSpreads}
        />
      </section>

      <section className="surface-card topic-panel">
        <div className="panel-intro compact-panel-intro">
          <p className="section-label">选择主题</p>
          <h3>从五个常见场景里，选一个最接近现在的方向</h3>
          <p>
            先定主题，再组织语言，会更容易把注意力收回来，也能让后面的牌阵解读更贴近你当下真正关心的事。
          </p>
        </div>

        <TopicPicker
          onSelect={onTopicChange}
          selectedTopic={selectedTopic}
          topics={selectableTopics}
        />
      </section>

      <section className="setup-columns">
        <article className="surface-card question-card">
          <div className="panel-intro compact-panel-intro">
            <p className="section-label">输入问题</p>
            <h3>一句话就够，不需要写成问卷</h3>
            <p>
              你可以带着一个具体但温和的问题进入抽牌，比如“我该如何面对这段关系里的迟疑？”；如果一时还没有完整句子，也可以先留空。
            </p>
          </div>

          <QuestionField
            maxLength={56}
            onChange={onQuestionChange}
            placeholder={questionPlaceholders[selectedTopic]}
            value={question}
          />

          {riskAssessment.shouldBlock && (
            <section className="risk-alert" aria-live="polite">
              <p className="section-label">已停止继续抽牌</p>
              <h3>这个问题超出了当前工具适合处理的范围</h3>
              <p>{riskAssessment.message}</p>
              <div className="risk-tag-list">
                {riskAssessment.riskTypes.map((type) => (
                  <span className="risk-tag" key={type}>
                    {getHighRiskTypeLabel(type)}
                  </span>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="surface-card setup-summary">
          <p className="section-label">当前准备</p>
          <h3>{currentTopic.label}</h3>
          <p className="summary-copy">{currentTopic.focus}</p>

          <dl className="summary-list">
            <div>
              <dt>抽牌模式</dt>
              <dd>{selectedSpread.name}</dd>
            </div>
            <div>
              <dt>已选主题</dt>
              <dd>{currentTopic.label}</dd>
            </div>
            <div>
              <dt>问题草稿</dt>
              <dd>{draftQuestion || "你可以暂时不写，让抽牌先保持开放。"}</dd>
            </div>
          </dl>

          <div className="summary-actions">
            <button
              className="primary-button"
              disabled={riskAssessment.shouldBlock}
              onClick={handleContinue}
              type="button"
            >
              {riskAssessment.shouldBlock ? "当前问题不进入抽牌流程" : "下一步：开始抽牌"}
            </button>
            <p className="inline-note">
              {riskAssessment.shouldBlock
                ? "如果问题涉及医疗、投资、法律或心理危机，请优先寻求专业支持。"
                : `${selectedSpread.shortLabel}会在下一页直接进入轻量洗牌和正式抽牌。`}
            </p>
          </div>
        </aside>
      </section>

      <section className="surface-card setup-footer-tools">
        <div className="setup-footer-actions">
          <a className="back-link" href="#home">
            返回首页
          </a>
          <button
            className="secondary-button"
            onClick={() => setIsDisclaimerOpen(true)}
            type="button"
          >
            查看免责声明
          </button>
        </div>

        <p className="setup-footer-status">
          {hasAcknowledgedDisclaimer ? "当前设备已确认边界说明" : "建议先阅读边界说明"}
        </p>
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
    </section>
  );
}
