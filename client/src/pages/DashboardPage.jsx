import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import JobCard from "../components/JobCard";
import JobFormModal from "../components/JobFormModal";
import api from "../api/axiosInstance";
import "./DashboardPage.css";

const toText = (value, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const extractErrorMessage = (err, fallback) => {
  const message = err?.response?.data?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  if (message && typeof message === "object") {
    try {
      return JSON.stringify(message);
    } catch {
      return fallback;
    }
  }
  return err?.message || fallback;
};

function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [jobs, setJobs] = useState([]);
  const [loadingJob, setLoadingJobs] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [errorJobs, setErrorJobs] = useState("");
  const [stats, setStats] = useState({
    APPLIED: 0,
    INTERVIEWING: 0,
    OFFER: 0,
    REJECTED: 0,
    GHOSTED: 0,
  });

  const normalizeJob = (job) => ({
    ...job,
    company: toText(job.company, "Unknown company"),
    position: toText(job.position, "Unknown position"),
    status: toText(job.status, "APPLIED"),
    priority: toText(job.priority, "MEDIUM"),
    location: toText(job.location, "N/A"),
    appliedDate: job.applied_date,
    interviewDate: job.interview_date,
    jobUrl: job.job_url,
    contactName: job.contact_name,
    contactEmail: job.contact_email,
  });

  const fetchJobs = useCallback(async () => {
    try {
      setLoadingJobs(true);
      setErrorJobs("");
      const params = {};
      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }
      if (priorityFilter !== "ALL") {
        params.priority = priorityFilter;
      }
      const response = await api.get("/api/jobs", { params });
      setJobs((response.data.jobs || []).map(normalizeJob));
    } catch (err) {
      const message = err.response?.data?.message || "Không thể fetch jobs, vui lòng thử lại sau!";
      setErrorJobs(message);
    } finally {
      setLoadingJobs(false);
    }
  }, [statusFilter, priorityFilter]);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await api.get("/api/jobs/stats");
      const rawStats = response.data?.stats || {};
      setStats({
        APPLIED: toNumber(rawStats.APPLIED),
        INTERVIEWING: toNumber(rawStats.INTERVIEWING),
        OFFER: toNumber(rawStats.OFFER),
        REJECTED: toNumber(rawStats.REJECTED),
        GHOSTED: toNumber(rawStats.GHOSTED),
      });
    } catch (err) {
      const message = extractErrorMessage(err, "Không thể fetch States!. Vui lòng thử lại");
      setErrorJobs(message);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleJobCreated = async () => {
    await Promise.all([fetchJobs(), fetchStatus()]);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      setDeletingJobId(jobId);
      setErrorJobs("");
      await api.delete(`/api/jobs/${jobId}`);
      await Promise.all([fetchJobs(), fetchStatus()]);
    } catch (err) {
      const message = extractErrorMessage(err, "Không thể xóa job, vui lòng thử lại.");
      setErrorJobs(message);
    } finally {
      setDeletingJobId(null);
    }
  };

  const openModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingJob(null);
    setIsModalOpen(false);
  };

  return (
    <main className="dashboard-page page-shell">
      <Navbar />
      {errorJobs && (<div className="error-message">{toText(errorJobs, "Đã có lỗi xảy ra")}</div>)}

      <header className="dashboard-header">
        <div>
          <h1 className="page-title">Job Pipeline</h1>
          <p className="page-subtitle">
            Monitor your opportunities and keep momentum in your search.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          + New Job
        </button>
      </header>
        {loadingJob && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 0",
          gap: "12px",
          color: "#6b7280"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            border: "3px solid #e5e7eb",
            borderTop: "3px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <p style={{ margin: 0, fontSize: "14px" }}>Đang tải danh sách jobs...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <StatsBar stats={stats} />

      <FilterBar
        status={statusFilter}
        priority={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <section className="jobs-grid">
        {jobs.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            index={index}
            onDelete={handleDeleteJob}
            onEdit={openEditModal}
            isDeleting={deletingJobId === job.id}
          />
        ))}
      </section>

      <JobFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleJobCreated}
        initialData={editingJob}
      />
    </main>
  );
}

export default DashboardPage;
