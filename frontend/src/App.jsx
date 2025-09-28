import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaCheck } from "react-icons/fa";
import api from "./api.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setTodos(res.data || []);
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
      // small visual delay could help UX but keep it instantaneous
    } catch (err) {
      console.error("Add todo failed", err);
    }
    setText("");
  };

  const deleteTodo = async (id) => {
    await api.delete(`/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const toggleComplete = async (id, completed) => {
    const res = await api.put(`/${id}`, { completed: !completed });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-6">
      <div className="w-full max-w-xl glass-card p-6 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Todo — beautiful & simple
            </h1>
            <p className="text-sm text-gray-200/80">
              A lightweight MERN Todo starter with a clean UI
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-200/70">Total</div>
            <div className="text-lg font-semibold">{total}</div>
          </div>
        </header>

        <form onSubmit={addTodo} className="flex gap-3 mb-5">
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
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-md"
          >
            <FaPlus />
            <span className="hidden md:inline">Add</span>
          </button>
        </form>

        <div className="mb-4 flex items-center justify-between text-sm text-gray-200/80">
          <div>{completedCount} completed</div>
          <div>{total - completedCount} left</div>
        </div>

        {/* Todo list */}
        <ul className="space-y-3">
          {loading ? (
            <li className="p-4 bg-white/6 rounded-lg animate-pulse h-14"></li>
          ) : todos.length === 0 ? (
            <li className="p-6 text-center text-gray-200/70">
              No todos yet — add your first task ✨
            </li>
          ) : (
            todos.map((todo) => (
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
                  <span
                    onClick={() => toggleComplete(todo._id, todo.completed)}
                    className={`cursor-pointer select-none ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-white"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-red-400 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
