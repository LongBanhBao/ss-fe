import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileTeacher.css';

const ProfileTeacher: React.FC = () => {
  const navigate = useNavigate();

  const handleUpdateClick = () => {
    navigate('/change-password');
  };

  return (
    <div className="profile-wrapper">
      {/* Phần thông tin giáo viên - bên trái */}
      <div className="profile-info-section">
        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar">
            <div className="avatar-circle">
              <img 
                src="/default-avatar.png" 
                alt="Avatar" 
                className="avatar-img"
              />
            </div>
          </div>

          {/* Thông tin giáo viên */}
          <div className="info-block">
            <div className="info-header">
              Thông tin giáo viên
            </div>
            <div className="info-content">
              <div className="info-row">
                <span className="info-label">Mã giáo viên:</span>
                <span className="info-value"></span>
              </div>
              <div className="info-row">
                <span className="info-label">Họ tên:</span>
                <span className="info-value"></span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày sinh:</span>
                <span className="info-value"></span>
              </div>
              <div className="info-row">
                <span className="info-label">Nơi sinh:</span>
                <span className="info-value"></span>
              </div>
              <div className="info-row">
                <span className="info-label">Số điện thoại:</span>
                <span className="info-value"></span>
              </div>
              <div className="info-row">
                <span className="info-label">Giới tính:</span>
                <span className="info-value"></span>
              </div>
            </div>
          </div>

          {/* Nút cập nhật */}
          <div className="button-container">
            <button className="update-button" onClick={handleUpdateClick}>
              Cập nhật thông tin cá nhân
            </button>
          </div>
        </div>
      </div>

      {/* Phần thông tin lớp dạy - bên phải */}
      <div className="academic-info-section">
        {/* Lớp đang dạy */}
        <div className="class-info-card">
          <h2 className="section-title">Lớp đang dạy</h2>
          <div className="class-content">
            <table className="class-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên lớp</th>
                  <th>Số học sinh</th>
                </tr>
              </thead>
              <tbody>
                {/* Để trống phần body của bảng */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danh sách bài tập đã giao */}
        <div className="exercises-card">
          <h2 className="section-title">Danh sách bài tập đã tạo</h2>
          <div className="exercises-list">
            <table className="exercises-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên bài tập</th>
                  <th>Lớp</th>
                  <th>Ngày giao</th>
                </tr>
              </thead>
              <tbody>
                {/* Để trống phần body của bảng */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTeacher;
