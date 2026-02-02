import { Toaster } from "react-hot-toast";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ListPage from "./pages/List";
import AddPage from "./pages/Add";
import AuthPage from "./pages/Auth";
// import ListPage from "./pages/List";
// import AddPage from "./pages/Add";
// import EditPage from "./pages/Edit";

type User = {
  id: number;
  username: string;
  email: string;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    nav("/");
  };
  return (
    <>
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="#" className="text-xl font-semibold">
            <strong>WEB502 App</strong>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="#" className="hover:text-gray-200">
              Trang chủ
            </Link>
            <Link to="/list" className="hover:text-gray-200">
              Danh sách
            </Link>
            <Link to="/add" className="hover:text-gray-200">
              Thêm mới
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-white">Xin chào, {user.username}</span>
                <button onClick={handleLogout} className="hover:text-gray-200 text-white">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/auth" className="hover:text-gray-200">
                  Đăng nhập
                </Link>
                <Link to="/auth" className="hover:text-gray-200">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto mt-10 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Chào mừng đến với WEB502</h1>
        <Routes>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route path="/list" element={<ListPage />}></Route>
          <Route path="/add" element={<AddPage />}></Route>
        </Routes>
      </div>

      <Toaster />
    </>
  );
}

export default App;