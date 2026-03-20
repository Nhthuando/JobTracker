import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./Navbar.css";

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

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "User",
    avatar: "U",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/api/auth/me");
        const name = toText(response.data?.name, "User");
        setUser({
          name,
          avatar: name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        });
      } catch (err) {
        const message = extractErrorMessage(err, "Không thể tải thông tin người dùng.");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar surface-card">
      <div className="navbar-logo-wrap">
        <span className="navbar-logo-dot" />
        <span className="navbar-logo-text">JobTrackr</span>
      </div>

      <div className="navbar-user-wrap">
        <span className="navbar-user-name">{loading ? "..." : toText(user.name, "User")}</span>
        <span className="navbar-avatar">{toText(user.avatar, "U")}</span>
        <button className="btn btn-ghost navbar-logout" onClick={handleLogout}>
          Logout
        </button>
        {error && <span className="navbar-user-name">{toText(error, "Lỗi tải user")}</span>}
      </div>
    </nav>
  );
}

export default Navbar;
