import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaCheck, FaBell } from "react-icons/fa";
import api from "./api.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const showNotification = (message, type = "success") => {
    setNotificationType(type);
    setNotification(message);
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setTodos(res.data || []);
    } catch (err) {
      console.error("Fetch todos failed", err);
      showNotification("Unable to load tasks. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await api.post("/", { text: text.trim() });
      setTodos([res.data, ...todos]);
      showNotification("Todo added successfully.");
    } catch (err) {
      console.error("Add todo failed", err);
      showNotification("Failed to add todo.", "error");
    }

    setText("");
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
      showNotification("Todo deleted.");
    } catch (err) {
      console.error("Delete todo failed", err);
      showNotification("Unable to delete todo.", "error");
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await api.put(`/${id}`, { completed: !completed });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      showNotification(
        `Todo marked ${!completed ? "complete" : "incomplete"}.`
      );
    } catch (err) {
      console.error("Update todo failed", err);
      showNotification("Unable to update todo.", "error");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const aDate = new Date(a.createdAt).getTime();
    const bDate = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
  });

  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const leftCount = total - completedCount;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-6 overflow-hidden">
      <div
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: "all 0.3s ease-out",
        }}
        className="fixed w-96 h-96 bg-gradient-to-r from-blue-400/20 via-sky-400/20 to-cyan-400/20 rounded-full blur-3xl pointer-events-none z-0"
      ></div>

      {notification && (
        <div
          className={`fixed right-5 top-5 z-30 flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl ${
            notificationType === "error"
              ? "bg-rose-500/95 text-white"
              : "bg-emerald-500/95 text-white"
          }`}
        >
          <FaBell className="opacity-90" />
          {notification}
        </div>
      )}

      <div className="w-full max-w-xl glass-card p-6 md:p-8 relative z-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Todo — beautiful & simple
            </h1>
            <p className="text-sm text-gray-200/80">
              Filter, sort, and track your tasks with quick feedback.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-200/70">Total</div>
            <div className="text-lg font-semibold">{total}</div>
          </div>
        </header>

        <form
          onSubmit={addTodo}
          className="flex flex-col gap-3 sm:flex-row mb-5"
        >
          <input
            type="text"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 placeholder-gray-200/60 text-white outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="submit"
            aria-label="Add"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
          >
            <FaPlus />
            <span className="hidden md:inline">Add</span>
          </button>
        </form>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Completed" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  filter === item.key
                    ? "border-indigo-400 bg-indigo-500 text-white"
                    : "border-white/15 bg-white/5 text-gray-200 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-200/80">
            <span>Sort</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-xl bg-white/10 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="newest" className="text-black bg-white">
                Newest first
              </option>
              <option value="oldest" className="text-black bg-white">
                Oldest first
              </option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-200/80">
          <div>
            Showing{" "}
            <span className="font-semibold text-white">
              {sortedTodos.length}
            </span>{" "}
            of <span className="font-semibold text-white">{total}</span> tasks
          </div>
          <div className="flex gap-4">
            <div>{completedCount} completed</div>
            <div>{leftCount} left</div>
          </div>
        </div>

        <ul className="space-y-3">
          {loading ? (
            <li className="p-4 bg-white/6 rounded-lg animate-pulse h-14"></li>
          ) : sortedTodos.length === 0 ? (
            <li className="p-6 text-center text-gray-200/70 rounded-3xl bg-white/5">
              No todos in this view — try a different filter.
            </li>
          ) : (
            sortedTodos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center justify-between bg-white/5 p-3 rounded-lg shadow-sm hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(todo._id, todo.completed)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                      todo.completed
                        ? "bg-green-500 border-transparent text-white"
                        : "bg-transparent border-white/10 text-gray-200"
                    } transition`}
                    aria-label={
                      todo.completed ? "Mark incomplete" : "Mark complete"
                    }
                  >
                    <FaCheck />
                  </button>
                  <div>
                    <p
                      onClick={() => toggleComplete(todo._id, todo.completed)}
                      className={`cursor-pointer select-none text-sm sm:text-base ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-white"
                      }`}
                    >
                      {todo.text}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(todo.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-400 hover:text-red-500"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
