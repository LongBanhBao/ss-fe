import React, { useState } from "react";
import "./ForgotPassword.css"; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //Haha
    } catch (error) {
      setMessage("Gửi email thất bại");
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
            Gửi email khôi phục
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
