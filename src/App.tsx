import { Toaster } from "react-hot-toast";
import { Link, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import List from "./pages/List";
import Add from "./pages/Add";
import Edit from "./pages/Edit";

function App() {
  return (
    <>
      {/* HEADER */}
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            WEB502 App
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-200">
              Trang chủ
            </Link>
            <Link to="/list" className="hover:text-gray-200">
              Danh sách
            </Link>
            <Link to="/add" className="hover:text-gray-200">
              Thêm mới
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto mt-10 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </main>

      {/* TOAST */}
      <Toaster />
    </>
  );
}

export default App;
