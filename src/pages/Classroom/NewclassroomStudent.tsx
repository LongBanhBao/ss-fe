import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thay đổi từ useHistory sang useNavigate

const NewclassroomStudent: React.FC = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate để chuyển hướng
  const [classCode, setClassCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn reload trang
    if (classCode === "123") {
      navigate("/classroom"); // Chuyển hướng đến trang Classroom
    } else {
      setErrorMessage("Không tồn tại lớp học này"); // Hiển thị thông báo lỗi
    }
  };

  return (
    <div className="new-classroom-container">
      <h2>Nhập mã lớp học</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={classCode}
          onChange={handleInputChange}
          placeholder="Nhập mã lớp học"
        />
        <button type="submit">Xác nhận</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default NewclassroomStudent;
