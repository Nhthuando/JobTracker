import "./JobCard.css";

const STATUS_META = {
  APPLIED: { color: "#3b82f6", label: "Applied" },
  INTERVIEWING: { color: "#f59e0b", label: "Interviewing" },
  OFFER: { color: "#10b981", label: "Offer" },
  REJECTED: { color: "#ef4444", label: "Rejected" },
  GHOSTED: { color: "#6b7280", label: "Ghosted" }
};

function JobCard({ job, index, onDelete, onEdit, isDeleting = false }) {
  const meta = STATUS_META[job.status] || STATUS_META.APPLIED;
  const priority = (job.priority || "MEDIUM").toLowerCase();
  const appliedDate = job.appliedDate || job.applied_date;
  const displayAppliedDate = appliedDate
    ? new Date(appliedDate).toLocaleDateString("vi-VN")
    : "N/A";

  return (
    <article
      className="job-card surface-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <header className="job-card-head">
        <h3 className="job-position">{job.position}</h3>
        <span
          className="job-status"
          style={{
            color: meta.color,
            background: `${meta.color}26`
          }}
        >
          {meta.label}
        </span>
      </header>

      <div className="job-meta">
        <p>{job.company}</p>
        <p>{job.location}</p>
        <p>Applied: {displayAppliedDate}</p>
      </div>

      <footer className="job-footer">
        <span className={`priority-chip priority-${priority}`}>
          {job.priority} Priority
        </span>

        <div className="job-actions">
          <button className="icon-btn" aria-label="Edit job" onClick={() => onEdit?.(job)}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
          <button
            className="icon-btn"
            aria-label="Delete job"
            onClick={() => onDelete?.(job.id)}
            disabled={isDeleting}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>
      </footer>
    </article>
  );
}

export default JobCard;
