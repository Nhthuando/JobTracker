import "./StatsBar.css";

const STATUS_META = {
  APPLIED: { label: "Applied", color: "#3b82f6" },
  INTERVIEWING: { label: "Interviewing", color: "#f59e0b" },
  OFFER: { label: "Offer", color: "#10b981" },
  REJECTED: { label: "Rejected", color: "#ef4444" },
  GHOSTED: { label: "Ghosted", color: "#6b7280" }
};

const toCount = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

function StatsBar({ stats }) {
  const statsItem = Object.keys(STATUS_META).map((status) => {
    const count = toCount(stats?.[status] ?? 0);
    return {
      status,
      ...STATUS_META[status],
      count
    };
  });

  return (
    <section className="stats-grid">
      {statsItem.map((item) => (
        <article
          key={item.status}
          className="stats-item surface-card"
          style={{ borderTopColor: item.color }}
        >
          <p className="stats-label">{item.label}</p>
          <h3 className="stats-value">{item.count}</h3>
        </article>
      ))}
    </section>
  );
}

export default StatsBar;
