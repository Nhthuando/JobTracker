import "./FilterBar.css";

function FilterBar({ status, priority, onStatusChange, onPriorityChange }) {
  return (
    <section className="filter-bar surface-card">
      <label className="filter-field" htmlFor="statusFilter">
        <span>Status</span>
        <select
          id="statusFilter"
          className="select-control"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="ALL">All status</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="GHOSTED">Ghosted</option>
        </select>
      </label>

      <label className="filter-field" htmlFor="priorityFilter">
        <span>Priority</span>
        <select
          id="priorityFilter"
          className="select-control"
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value)}
        >
          <option value="ALL">All priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </label>
    </section>
  );
}

export default FilterBar;
