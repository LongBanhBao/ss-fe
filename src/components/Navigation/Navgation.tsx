import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navgation.css";
import { useAuth } from "@/context/AuthContext";

const Navigation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const searchAlgorithms = [
    { name: "Tìm kiếm tuần tự", path: "/tktt" },
    { name: "Tìm kiếm nhị phân", path: "/tknp" },
  ];

  const sortAlgorithms = [
    { name: "Sắp xếp chọn", path: "/sx-chon" },
    { name: "Sắp xếp chèn", path: "/sx-chen" },
    { name: "Sắp xếp nổi bọt", path: "/sx-noi-bot" },
  ];
  React.useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [location]);

  const handleLogout = () => {
    if (window.confirm("Bạn có muốn đăng xuất không?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="nav-container">
      <div className="nav-inner">
        <div className="nav-content">
          <div className="nav-left">
            <Link to="/" className="nav-link">
              Trang chủ
            </Link>

            <div className="relative group">
              <button className="nav-link">Thuật toán</button>

              <div className={`nav-dropdown ${!isVisible && "hidden"}`}>
                <div className="relative group">
                  <button className="nav-dropdown-item">
                    Thuật toán tìm kiếm
                  </button>

                  <div className={`nav-submenu ${!isVisible && "hidden"}`}>
                    {searchAlgorithms.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="nav-dropdown-item"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <button className="nav-dropdown-item">
                    Thuật toán sắp xếp
                  </button>

                  <div className={`nav-submenu ${!isVisible && "hidden"}`}>
                    {sortAlgorithms.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="nav-dropdown-item"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="nav-link">Bài tập</button>

              <div className="nav-dropdown">
                <Link to="/coder" className="nav-dropdown-item">
                  Coder
                </Link>
                <Link to="/list-exercise" className="nav-dropdown-item">
                  Bài tập Coding
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-right">
            {user ? (
              <>
              <div  className="text-white font-bold">{`${user.first_name} ${user.last_name}`}</div>
              <div className="flex items-center gap-4">
                <Link to={`/profile/${user?.id}`} className="nav-avatar">
                  <span className="text-gray-600 text-sm">
                    {user?.first_name?.[0] || "A"}
                  </span>
                </Link>
                <button onClick={handleLogout} className="nav-auth-link">
                  Đăng xuất
                </button>
              </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-auth-link">
                  Đăng nhập
                </Link>
                <Link to="/register" className="nav-auth-link">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
