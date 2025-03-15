import { forgotPassword } from "@/services/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage("Gửi email thành công");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center">
      <div className="container">
        <h2 className="title">Quên mật khẩu</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
            required
          />
          <button type="submit" className="button">
            {loading ? "Loading..." : "Gửi email"}
          </button>
        </form>
        {message && <p className={`text-red-500`}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
