type QuestionFieldProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
};

export function QuestionField({
  value,
  onChange,
  maxLength,
  placeholder,
}: QuestionFieldProps) {
  return (
    <label className="field-shell">
      <span className="field-label">你的问题</span>
      <textarea
        className="question-input"
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        value={value}
      />
      <div className="field-meta">
        <p className="helper-note">
          这里更适合写一句短问题，用来帮助你整理思路，而不是追问确定的结果会不会发生。
        </p>
        <span className="char-counter">{value.length}/{maxLength}</span>
      </div>
    </label>
  );
}