import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  teacher: string;
}

function ListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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
    filterAndPaginateProducts();
  }, [allProducts, searchName, filterTeacher, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/products");
      setAllProducts(response.data);
      
      // Lấy danh sách teacher duy nhất
      const uniqueTeachers = Array.from(
        new Set(response.data.map((p: Product) => p.teacher))
      );
      setTeachers(uniqueTeachers as string[]);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateProducts = () => {
    let filtered = allProducts;

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
    const paginatedProducts = filtered.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setProducts(paginatedProducts);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setAllProducts(allProducts.filter((p) => p.id !== id));
      setCurrentPage(1);
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const getTotalPages = () => {
    let filtered = allProducts;

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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Danh sách sản phẩm</h1>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách sản phẩm</h1>

      {/* Tìm kiếm và Lọc */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">Tìm kiếm (Tên)</label>
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Lọc theo Giảng viên</label>
          <select
            value={filterTeacher}
            onChange={(e) => {
              setFilterTeacher(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả giảng viên</option>
            {teachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Không có sản phẩm nào. <Link to="/add" className="text-blue-600 hover:text-blue-800 hover:underline">Thêm mới</Link>
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    ID
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Tên sản phẩm
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Giá
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Giảng viên
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Mô tả
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300">
                      {product.id}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {product.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {product.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {product.teacher}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {product.description}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 space-x-2">
                      <Link
                        to={`/edit/${product.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 hover:underline ml-2"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage(Math.min(getTotalPages(), currentPage + 1))
              }
              disabled={currentPage === getTotalPages()}
              className="px-3 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
