import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h2 className="home-title">Thuật Toán Tìm Kiếm</h2>
        <div className="home-links">
          <Link to="/tktt" className="home-link">
            Tìm Kiếm Tuần Tự
          </Link>
          <Link to="/tknp" className="home-link">
            Tìm Kiếm Nhị Phân
          </Link>
        </div>
        <h2 className="home-title">Thuật Toán Sắp Xếp</h2>
        <div className="home-links">
          <Link to="/sx-chon" className="home-link">
            Sắp Xếp Chọn
          </Link>
          <Link to="/sx-chen" className="home-link">
            Sắp Xếp Chèn
          </Link>
          <Link to="/sx-noi-bot" className="home-link">
            Sắp Xếp Nổi Bọt
          </Link>
        </div>
        <h2 className="home-title">Coder</h2>
        <div className="home-links">
          <Link to="/coder" className="home-link">
            Coder
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
