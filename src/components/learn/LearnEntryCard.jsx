import "./Learn.css";

const TYPE_LABELS = {
  term: "Term",
  document_guide: "Document",
  role: "Role",
};

/**
 * LearnEntryCard — compact card for the index grid.
 * Shows type badge, title, and truncated summary.
 */
export default function LearnEntryCard({ entry, onClick, compact = false }) {
  const typeLabel = TYPE_LABELS[entry.type] || entry.type;

  return (
    <button
      type="button"
      className={`learn-card ${compact ? "learn-card--compact" : ""}`}
      onClick={onClick}
    >
      <span className={`learn-card__badge learn-card__badge--${entry.type}`}>
        {typeLabel}
      </span>
      <h3 className="learn-card__title">{entry.title}</h3>
      {!compact && entry.summary && (
        <p className="learn-card__summary">
          {entry.summary.length > 160
            ? entry.summary.slice(0, 160) + "..."
            : entry.summary}
        </p>
      )}
    </button>
  );
}
