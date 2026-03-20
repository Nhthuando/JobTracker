import { useState } from "react";
import api from "../api/axiosInstance";
import "./JobFormModal.css";

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

function JobFormModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isEditMode = Boolean(initialData?.id);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSaving(true);
    setSubmitError("");

    try {
      const formData = new FormData(form);
      const payload = {
        company: (formData.get("company") || "").toString().trim(),
        position: (formData.get("position") || "").toString().trim(),
        status: (formData.get("status") || "APPLIED").toString().trim(),
        priority: (formData.get("priority") || "MEDIUM").toString().trim(),
        source: (formData.get("source") || "").toString().trim(),
        appliedDate: (formData.get("appliedDate") || "").toString().trim(),
        interviewDate: (formData.get("interviewDate") || "").toString().trim(),
        salary: (formData.get("salary") || "").toString().trim(),
        location: (formData.get("location") || "").toString().trim(),
        jobUrl: (formData.get("jobUrl") || "").toString().trim(),
        contactName: (formData.get("contactName") || "").toString().trim(),
        contactEmail: (formData.get("contactEmail") || "").toString().trim(),
        notes: (formData.get("notes") || "").toString().trim(),
      };

      if (isEditMode) {
        const nullableFields = [
          "source",
          "appliedDate",
          "interviewDate",
          "salary",
          "location",
          "jobUrl",
          "contactName",
          "contactEmail",
          "notes",
        ];

        nullableFields.forEach((key) => {
          if (payload[key] === "") {
            payload[key] = null;
          }
        });
      } else {
        Object.keys(payload).forEach((key) => {
          if (payload[key] === "") {
            delete payload[key];
          }
        });
      }

      if (isEditMode) {
        await api.put(`/api/jobs/${initialData.id}`, payload);
      } else {
        await api.post("/api/jobs", payload);
      }
      form.reset();
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (err) {
      const fallback = isEditMode
        ? "Cập nhật job thất bại, vui lòng thử lại."
        : "Tạo job thất bại, vui lòng thử lại.";
      const message = err.response?.data?.message || fallback;
      setSubmitError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <section
        className="job-modal surface-card"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="job-modal-head">
          <h2>{isEditMode ? "Update Job Entry" : "Create Job Entry"}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            X
          </button>
        </header>

        {submitError && <div className="error-message">{submitError}</div>}

        <form className="job-form" onSubmit={handleSubmit}>
          <label>
            Company
            <input className="input-control" name="company" placeholder="Acme Inc" defaultValue={initialData?.company || ""} />
          </label>
          <label>
            Position
            <input className="input-control" name="position" placeholder="Frontend Engineer" defaultValue={initialData?.position || ""} />
          </label>
          <label>
            Status
            <select className="select-control" name="status" defaultValue={initialData?.status || "APPLIED"}>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="GHOSTED">Ghosted</option>
            </select>
          </label>
          <label>
            Priority
            <select className="select-control" name="priority" defaultValue={initialData?.priority || "MEDIUM"}>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </label>
          <label>
            Source
            <input className="input-control" name="source" placeholder="LinkedIn" defaultValue={initialData?.source || ""} />
          </label>
          <label>
            Applied Date
            <input className="input-control" name="appliedDate" type="date" defaultValue={toDateInput(initialData?.appliedDate || initialData?.applied_date)} />
          </label>
          <label>
            Interview Date
            <input className="input-control" name="interviewDate" type="date" defaultValue={toDateInput(initialData?.interviewDate || initialData?.interview_date)} />
          </label>
          <label>
            Salary
            <input className="input-control" name="salary" placeholder="$120k - $150k" defaultValue={initialData?.salary || ""} />
          </label>
          <label>
            Location
            <input className="input-control" name="location" placeholder="Remote" defaultValue={initialData?.location || ""} />
          </label>
          <label>
            Job URL
            <input className="input-control" name="jobUrl" placeholder="https://..." defaultValue={initialData?.jobUrl || initialData?.job_url || ""} />
          </label>
          <label>
            Contact Name
            <input className="input-control" name="contactName" placeholder="Recruiter name" defaultValue={initialData?.contactName || initialData?.contact_name || ""} />
          </label>
          <label>
            Contact Email
            <input className="input-control" name="contactEmail" type="email" placeholder="recruiter@company.com" defaultValue={initialData?.contactEmail || initialData?.contact_email || ""} />
          </label>
          <label className="full-width">
            Notes
            <textarea className="textarea-control" name="notes" placeholder="Any context for this role..." defaultValue={initialData?.notes || ""} />
          </label>

          <footer className="job-modal-foot full-width">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              {isSaving ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default JobFormModal;
