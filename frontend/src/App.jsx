import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [focusMode, setFocusMode] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "PUT" });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const visibleTasks = focusMode
    ? tasks.filter((t) => !t.completed)
    : tasks;

  return (
    <div className="app-container">
      <div className="card">
        <h1>Task Board</h1>

        {/* Add Task */}
        <div className="add-task">
          <input
            placeholder="Enter a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {/* Focus Mode */}
        <button
          className={`focus-btn ${focusMode ? "focus-on" : "focus-off"}`}
          onClick={() => setFocusMode(!focusMode)}
        >
          {focusMode ? "Focus Mode ON (Pending Only)" : "Enable Focus Mode"}
        </button>

        {/* Progress */}
        <div className="progress-text">{progress}% completed</div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Task List */}
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? "completed" : ""}>
                  {task.title}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {focusMode && visibleTasks.length === 0 && (
          <p className="empty-message">
            🎯 All tasks completed. Great job!
          </p>
        )}
      </div>
    </div>
  );
}
