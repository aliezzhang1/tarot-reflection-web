type ShareCardConfirmDialogProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const confirmNotes = [
  "分享卡片默认不包含你输入的问题原文。",
  "不会带上笔记、历史记录详情或可识别个人信息。",
  "卡片会在当前设备本地生成，不会上传到服务器。",
];

export function ShareCardConfirmDialog({
  isOpen,
  onCancel,
  onConfirm,
}: ShareCardConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby="share-card-confirm-title"
      aria-modal="true"
      className="disclaimer-overlay"
      onClick={onCancel}
      role="dialog"
    >
      <div className="disclaimer-overlay-card" onClick={(event) => event.stopPropagation()}>
        <article className="surface-card disclaimer-card share-confirm-card">
          <p className="section-label">分享前确认</p>
          <h2 id="share-card-confirm-title">确认后再生成这张降敏分享卡片</h2>
          <p className="lede">
            这一步会先帮你把分享内容收束成牌面摘要，再在当前设备本地生成图片。你可以预览后决定是否下载或发出去。
          </p>

          <ul className="bullet-list disclaimer-list">
            {confirmNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="action-row">
            <button className="primary-button" onClick={onConfirm} type="button">
              确认并生成卡片
            </button>
            <button className="secondary-button" onClick={onCancel} type="button">
              先不生成
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}