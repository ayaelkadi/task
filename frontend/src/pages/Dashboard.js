import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask } from "../services/api";
import { updateTask } from "../services/api";


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 📥 جلب المهام
const fetchTasks = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await getTasks(token);

    if (!res.success) {
      setError(res.message);
    } else {
      setTasks(res.data);
    }

  } catch (err) {
    setError("Something went wrong");
  }

  setLoading(false);
};

  // ➕ إضافة مهمة
const handleAdd = async (e) => {
  e.preventDefault();

  if (!title) return;

  setLoading(true);

  try {
    await createTask(token, { title });
    setTitle("");
    fetchTasks();
  } catch (err) {
    setError("Failed to add task");
  }

  setLoading(false);
};

  const handleDelete = async (id) => {
    await deleteTask(token, id);
    fetchTasks();
  };

  const handleToggle = async (task) => {
    await updateTask(token, task._id, {
      completed: !task.completed,
    });

    fetchTasks();
  };

 return (
  <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Task Manager
        </h2>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Task */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg">
          Add
        </button>
      </form>

      {/* Tasks */}
      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
          >
            <span
              onClick={() => handleToggle(task)}
              className={`cursor-pointer ${
                task.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }`}
            >
              {task.title}
            </span>

            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

    </div>
  </div>
);
}
