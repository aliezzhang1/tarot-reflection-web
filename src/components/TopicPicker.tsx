import type { TarotReadingTopic } from "../content/tarotInterpretation";

type TopicOption = {
  id: TarotReadingTopic;
  label: string;
  focus: string;
};

type TopicPickerProps = {
  topics: readonly TopicOption[];
  selectedTopic: TarotReadingTopic;
  onSelect: (topic: TarotReadingTopic) => void;
};

export function TopicPicker({ topics, selectedTopic, onSelect }: TopicPickerProps) {
  return (
    <div className="topic-grid" role="list" aria-label="抽牌主题选择">
      {topics.map((topic) => {
        const isActive = topic.id === selectedTopic;

        return (
          <button
            aria-pressed={isActive}
            className={`topic-button${isActive ? " is-active" : ""}`}
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            type="button"
          >
            <span className="topic-title">{topic.label}</span>
            <span className="topic-copy">{topic.focus}</span>
          </button>
        );
      })}
    </div>
  );
}