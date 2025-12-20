import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskByIdApi, updateTaskApi } from "../lib/taskApi";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority_id: 1,
    status_id: 1,
    category_name: "",
  });

  // Ambil data task
  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await getTaskByIdApi(id);

        setForm({
          title: data.title || "",
          description: data.description || "",
          due_date: data.due_date
            ? data.due_date.split("T")[0]
            : "",
          priority_id: data.priority_id || 1,
          status_id: data.status_id || 1,
          category_name: data.category_name || "",
        });

        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data task");
        setLoading(false);
      }
    }

    fetchTask();
  }, [id]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await updateTaskApi(id, {
        title: form.title,
        description: form.description || null,
        due_date: form.due_date || null,
        priority_id: Number(form.priority_id),
        status_id: Number(form.status_id),
        category_name: form.category_name || null,
      });

      navigate(`/task/${id}`);
    } catch (err) {
      setError("Gagal mengupdate task");
    }
  }

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-xl font-bold">Edit Task</h1>

      {error && (
        <p className="mb-3 rounded bg-red-100 p-2 text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full rounded border p-2"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full rounded border p-2"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="due_date"
          className="w-full rounded border p-2"
          value={form.due_date}
          onChange={handleChange}
        />

        <select
          name="priority_id"
          className="w-full rounded border p-2"
          value={form.priority_id}
          onChange={handleChange}
        >
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
        </select>

        <select
          name="status_id"
          className="w-full rounded border p-2"
          value={form.status_id}
          onChange={handleChange}
        >
          <option value={1}>Todo</option>
          <option value={2}>In Progress</option>
          <option value={3}>Done</option>
        </select>

        <input
          type="text"
          name="category_name"
          placeholder="New Category (optional)"
          className="w-full rounded border p-2"
          value={form.category_name}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full rounded bg-primary p-2 font-bold text-white hover:opacity-90"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
