import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import "./Register.css";
import { register } from "@/services/auth";
import { UserRegister } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { isDate } from "date-fns";

const Register = () => {
  const [error, setError] = useState("");

  const [form, setForm] = useState<UserRegister>({
    email: "",
    password: "",
    role: "student",
    first_name: "",
    last_name: "",
    date_of_birth: new Date().toISOString(),
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.role === "teacher" && !form.email.includes("@lecturer")) {
      setError("Email không hợp lệ.");
      return;
    }
    register(form)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setError("Email đã tồn tại.");
        } else {
          setError("Registration failed. Please try again.");
        }
      });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-1/2">
        <h2 className="register-title">Đăng ký</h2>
        <form onSubmit={handleRegister} className="w-full">
          <div>
            <input
              type="email"
              name={"email"}
              value={form.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full register-input"
            />
          </div>
          <div>
            <input
              type="password"
              name={"password"}
              value={form.password}
              onChange={handleInputChange}
              placeholder="Mật khẩu"
              required
              className="w-full register-input"
            />
          </div>
          <div>
            <input
              type="text"
              name={"first_name"}
              value={form.first_name}
              onChange={handleInputChange}
              placeholder="Tên"
              required
              className="w-full register-input"
            />
          </div>
          <div>
            <input
              type="text"
              name={"last_name"}
              value={form.last_name}
              onChange={handleInputChange}
              placeholder="Họ"
              className="w-full register-input"
              required
            />
          </div>
          <div>
            <label htmlFor="">Ngày sinh</label>
            <DatePicker
              selected={new Date(form.date_of_birth)}
              name="date_of_birth"
              maxDate={new Date()}
              onChange={(date) => {
                if (isDate(date)) {
                  setForm((prev) => ({
                    ...prev,
                    date_of_birth: date.toISOString() || "", // Changed to use toISOString() for proper ISO format
                  }));
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày sinh"
              className="register-input"
              locale={vi}
              required
            />
          </div>
          <div className="register-role">
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={form.role === "student"}
                onChange={handleInputChange}
                required
                className=""
              />
              Học sinh
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={form.role === "teacher"}
                onChange={handleInputChange}
                required
              />
              Giáo viên
            </label>
          </div>
          <button type="submit" className="register-button">
            Đăng ký
          </button>
        </form>
        {error && <p className="register-error">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
