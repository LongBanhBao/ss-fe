import React, { useState } from "react";
import { login } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    setError("");
    e.preventDefault();
    login({ username: email, password })
      .then((res) => {
        if (res) {
          auth.login(res["access_token"]);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="login-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <div className="login-links">
          <a href="/register" className="login-link">
            Đăng kí
          </a>
          <a href="/forgot-password" className="login-link">
            Quên mật khẩu
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
