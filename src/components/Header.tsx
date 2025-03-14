import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex items-center h-16 px-4 text-white bg-purple-500">
      <Link to="/" className="flex items-center">
        <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-800 rounded-full">
          <img src="/logo.svg" alt="logo" className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold">Kết nối tương lai</h1>
      </Link>
    </header>
  );
};

export default Header;
