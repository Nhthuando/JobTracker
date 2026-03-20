import { Link, useNavigate } from "react-router-dom";
import {  useState } from "react";
import api from "../api/axiosInstance.js";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try{
      await api.post("/api/auth/register", {name,email,password});
      navigate("/login");
    } catch(err){
      const message = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page page-shell">
      <section className="register-card surface-card">
        <p className="register-kicker">Create account</p>
        <h1>Build your private career command center.</h1>
        <p className="register-subtext">
          Organize your applications, keep interview notes, and make better
          career decisions from one place.
        </p>

        {error && <div className="error-alert">Error {error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <label htmlFor="registerName">
            Name
            <input
              id="registerName"
              value={name}
              className="input-control"
              placeholder="Your full name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor="registerEmail">
            Email
            <input
              id="registerEmail"
              type="email"
              value={email}
              className="input-control"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="registerPassword">
            Password
            <input
              id="registerPassword"
              type="password"
              value={password}
              className="input-control"
              placeholder="Create a strong password"
              onChange={(e)=> setPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={loading} className="btn btn-primary register-submit">
            {loading ? "Đang đăng ký..." : "Register"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
