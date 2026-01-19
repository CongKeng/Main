import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function AddPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    try {
      await axios.post("http://localhost:3000/products", values);
      navigate("/products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm sản phẩm</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-2">Tên sản phẩm</label>
          <input {...register("name")} type="text" className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-2">Giá</label>
          <input {...register("price")} type="number" className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-2">Mô tả</label>
          <textarea {...register("description")} rows={3} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-2">Giáo viên</label>
          <input {...register("teacher")} type="text" className="w-full border rounded px-3 py-2" />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Thêm
        </button>
      </form>
    </div>
  );
}

export default AddPage;