import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface Product {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
}

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Product>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        const product = response.data;
        setValue("name", product.name);
        setValue("credit", product.credit);
        setValue("category", product.category);
        setValue("teacher", product.teacher);
      } catch (error) {
        console.log(error);
        toast.error("Không thể tải dữ liệu!");
      }
    };
    fetchProduct();
  }, [id, setValue]);

  const onSubmit = async (values: Product) => {
    try {
      await axios.put(`http://localhost:3000/products/${id}`, values);
      toast.success("Cập nhật thành công!");
      navigate("/products");
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Cập nhật #{id}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {/* Name input */}
        <div>
          <label className="block font-medium mb-1">Tên khóa học</label>
          <input
            {...register("name", { required: "Bắt buộc", minLength: { value: 3, message: "Min 3 ký tự" } })}
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name?.message}</span>}
        </div>

        {/* Credit input */}
        <div>
          <label className="block font-medium mb-1">Số tín chỉ</label>
          <input
            {...register("credit", { required: "Bắt buộc", min: { value: 1, message: "Phải > 0" } })}
            type="number"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.credit && <span className="text-red-500 text-sm">{errors.credit?.message}</span>}
        </div>

        {/* Category Select */}
        <div>
          <label className="block font-medium mb-1">Danh mục</label>
          <select
            {...register("category", { required: "Bắt buộc" })}
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Ngoại khóa">Ngoại khóa</option>
            <option value="Tự chọn">Tự chọn</option>
          </select>
          {errors.category && <span className="text-red-500 text-sm">{errors.category?.message}</span>}
        </div>

        {/* Teacher input */}
        <div>
          <label className="block font-medium mb-1">Giáo viên</label>
          <input
            {...register("teacher", { required: "Bắt buộc", minLength: { value: 3, message: "Min 3 ký tự" } })}
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.teacher && <span className="text-red-500 text-sm">{errors.teacher?.message}</span>}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default EditPage;
