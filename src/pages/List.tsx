import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
}

function ListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachers, setTeachers] = useState<string[]>([]);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndPaginate();
  }, [products, searchName, filterTeacher, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
      
      // Lấy danh sách teacher duy nhất
      const uniqueTeachers = Array.from(
        new Set(response.data.map((p: Product) => p.teacher))
      );
      setTeachers(uniqueTeachers as string[]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginate = () => {
    let filtered = products;

    // Tìm kiếm theo tên
    if (searchName.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Lọc theo teacher
    if (filterTeacher) {
      filtered = filtered.filter((p) => p.teacher === filterTeacher);
    }

    // Phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paged = filtered.slice(startIndex, startIndex + itemsPerPage);
    setFilteredProducts(paged);
  };

  const getTotalPages = () => {
    let filtered = products;

    if (searchName.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (filterTeacher) {
      filtered = filtered.filter((p) => p.teacher === filterTeacher);
    }

    return Math.ceil(filtered.length / itemsPerPage);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa khóa học này?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      setCurrentPage(1);
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách khóa học</h1>

      <Link to="/add" className="mb-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Thêm khóa học
      </Link>

      {/* Tìm kiếm và Lọc */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Tìm kiếm (Tên)</label>
          <input
            type="text"
            placeholder="Nhập tên khóa học..."
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Lọc theo Giáo viên</label>
          <select
            value={filterTeacher}
            onChange={(e) => {
              setFilterTeacher(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Tất cả giáo viên</option>
            {teachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 mt-4">Không có khóa học</p>
      ) : (
        <>
          <table className="w-full border mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Tên khóa học</th>
                <th className="px-4 py-2 border text-left">Tín chỉ</th>
                <th className="px-4 py-2 border text-left">Danh mục</th>
                <th className="px-4 py-2 border text-left">Giáo viên</th>
                <th className="px-4 py-2 border text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border">{product.id}</td>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">{product.credit}</td>
                  <td className="px-4 py-2 border">{product.category}</td>
                  <td className="px-4 py-2 border">{product.teacher}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link to={`/edit/${product.id}`} className="text-blue-600 hover:underline">
                      Sửa
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded ${
                  currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
              disabled={currentPage === getTotalPages()}
              className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Trang {currentPage} / {getTotalPages()}
          </p>
        </>
      )}
    </div>
  );
}

export default ListPage;
