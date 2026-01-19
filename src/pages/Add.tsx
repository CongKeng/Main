import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    try {
      await axios.post("http://localhost:3000/products", values);
      toast.success("Thêm thành công!");
      navigate("/products");
    } catch (error) {
      toast.error("Thêm thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm khóa học</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Tên khóa học</label>
          <input 
            {...register("name", { required: "Bắt buộc", minLength: { value: 3, message: "Min 3 ký tự" } })} 
            type="text" 
            className="w-full border rounded px-3 py-2" 
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name?.message}</span>}
        </div>

        <div>
          <label className="block mb-1">Số tín chỉ</label>
          <input 
            {...register("credit", { required: "Bắt buộc", min: { value: 1, message: "Phải > 0" } })} 
            type="number" 
            className="w-full border rounded px-3 py-2" 
          />
          {errors.credit && <span className="text-red-500 text-sm">{errors.credit?.message}</span>}
        </div>

        <div>
          <label className="block mb-1">Danh mục</label>
          <select 
            {...register("category", { required: "Bắt buộc" })} 
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Chọn --</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Ngoại khóa">Ngoại khóa</option>
            <option value="Tự chọn">Tự chọn</option>
          </select>
          {errors.category && <span className="text-red-500 text-sm">{errors.category?.message}</span>}
        </div>

        <div>
          <label className="block mb-1">Giáo viên</label>
          <input 
            {...register("teacher", { required: "Bắt buộc", minLength: { value: 3, message: "Min 3 ký tự" } })} 
            type="text" 
            className="w-full border rounded px-3 py-2" 
          />
          {errors.teacher && <span className="text-red-500 text-sm">{errors.teacher?.message}</span>}
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Thêm
        </button>
      </form>
    </div>
  );
}

export default AddPage;