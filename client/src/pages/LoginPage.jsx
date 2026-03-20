import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LoginPage.css";
import api from "../api/axiosInstance.js";

function LoginPage() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try{
      const response = await api.post("/api/auth/login", {email, password});
      const token = response.data.token;
      if (!token) {
        throw new Error("Không nhận được token đăng nhập.");
      }
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    }catch(err){
      const message = err.response?.data?.message || err.message || "Đăng nhập thất bại, thử lại.";
      setError(message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page page-shell">
      <section className="auth-grid">
        <article className="auth-brand surface-card">
          <p className="auth-brand-kicker">JobTrackr</p>
          <h1>Track every opportunity with clarity.</h1>
          <p>
            Keep your pipeline focused: applications, interviews, offers, and
            follow-ups in one refined developer-first workspace.
          </p>
        </article>

        <article className="auth-form-card surface-card">
          <h2>Welcome back</h2>
          <p>Sign in to continue your job tracking workflow.</p>
          {error && (<div className="error-message">{error}</div>)}
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="loginEmail">
              Email
              <input
                id="loginEmail"
                type="email"
                value={email}
                className="input-control"
                placeholder="you@example.com"
                onChange={(e)=> setEmail(e.target.value)}
              />
            </label>

            <label htmlFor="loginPassword">
              Password
              <input
                id="loginPassword"
                type="password"
                value={password}
                className="input-control"
                placeholder="Your password"
                onChange={(e)=> setPassword(e.target.value)}
              />
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="auth-footer-text">
            Need an account? <Link to="/register">Register now</Link>
          </p>
        </article>
      </section>
    </main>
  );
}

export default LoginPage;
