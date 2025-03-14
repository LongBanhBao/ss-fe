import React, { useState, useEffect } from "react";
import "./UpdateProfile.css";
import { UserUpdate } from "@/types/user";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "@/services/auth";
import DatePicker from "react-datepicker";
import { isDate } from "date-fns";
import { vi } from "date-fns/locale";
import { fromDateString, toDateCall } from "@/utils/datetime";
import { useAuth } from "@/context/AuthContext";

const UpdateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // State để lưu trữ thông tin người dùng
  const [userInfo, setUserInfo] = useState<UserUpdate>({
    first_name: null,
    last_name: null,
    date_of_birth: null,
  });
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth?.user?.id !== id) {
    navigate(`/profile/${auth.user?.id}`);
  }

  useEffect(() => {
    if (id) {
      getProfile(id)
        .then((res) => {
          setUserInfo({
            first_name: res.first_name,
            last_name: res.last_name,
            date_of_birth: res.date_of_birth,
          });
        })
        .catch((error) => {
          console.log(error);
          alert("Lỗi khi lấy thông tin người dùng");
        });
    }
  }, [id]);

  // Hàm xử lý khi input thay đổi
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      await updateProfile(userInfo);
      alert("Cập nhật thông tin thành công");
      navigate(`/profile/${id}`);
    } catch (error) {
      console.log(error);
      alert("Lỗi khi cập nhật thông tin sinh viên");
    }
  };

  return (
    <div className="update-profile-wrapper">
      <div className="update-profile-container">
        {/* Avatar section */}
        <div className="avatar-section">
          <div className="avatar-circle">
            <img
              src="https://api.dicebear.com/9.x/bottts/svg"
              alt="Avatar"
              className="avatar-img"
            />
          </div>
        </div>

        {/* Form section */}
        <div className="form-section">
          <div className="form-header">Thông tin sinh viên</div>

          <div className="form-content">
            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="first_name"
                value={userInfo.first_name || ""}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn"
              />
            </div>

            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="last_name"
                value={userInfo.last_name || ""}
                onChange={handleInputChange}
                placeholder="A"
              />
            </div>

            <div className="form-group">
              <label>Ngày sinh:</label>
              <DatePicker
                selected={fromDateString(
                  userInfo.date_of_birth || new Date().toISOString()
                )}
                name="date_of_birth"
                maxDate={new Date()}
                onChange={(date) => {
                  if (isDate(date)) {
                    setUserInfo((prev) => ({
                      ...prev,
                      date_of_birth: toDateCall(date),
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

            <button
              className="update-button"
              onClick={() => handleUpdateUser()}
            >
              Cập nhật thông tin cá nhân
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
