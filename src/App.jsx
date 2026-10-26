import { useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Card from "./components/Card";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Filter from "./components/Filter";

export default function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [undo, setUndo] = useState(null); // { task, index } of the last deleted task

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const pending = total - doneCount;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const counts = { all: total, active: pending, done: doneCount };

  const q = query.trim().toLowerCase();
  const visibleTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === "all" ? true : filter === "done" ? t.done : !t.done;
    return matchesFilter && t.title.toLowerCase().includes(q);
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.title = pending ? `(${pending}) Task Tracker` : "Task Tracker";
  }, [pending]);

  useEffect(() => {
    setSaved(true);
    const timerId = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(timerId);
  }, [tasks]);

  useEffect(() => {
    if (!undo) return;
    const timerId = setTimeout(() => setUndo(null), 5000);
    return () => clearTimeout(timerId);
  }, [undo]);

  function addTask(title, priority) {
    setTasks((prev) => [
      { id: crypto.randomUUID(), title, done: false, priority },
      ...prev,
    ]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  // One function for every kind of edit: pass only the fields that change.
  function updateTask(id, changes) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t))
    );
  }

  function deleteTask(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    setUndo({ task: tasks[index], index });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function undoDelete() {
    if (!undo) return;
    setTasks((prev) => {
      const next = [...prev];
      next.splice(Math.min(undo.index, next.length), 0, undo.task);
      return next;
    });
    setUndo(null);
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  const emptyMessage =
    total === 0
      ? "No tasks yet. Add your first one above."
      : q
      ? `No tasks match "${query}".`
      : "Nothing here. Try a different filter.";

  return (
    <main className="app">
      <header className="header">
        <h1>Task Tracker</h1>
        <div className="header-right">
          <p className="saved" aria-live="polite">{saved ? "Saved" : ""}</p>
          <button
            className="ghost outlined"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <Card title="Today">
        <div className="progress-row">
          <p className="big">{doneCount}<span>/{total}</span></p>
          <p className="muted">
            {pending === 0 && total > 0 ? "All done." : `${pending} left to do`}
          </p>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tasks completed"
        >
          <div
            className={`bar-fill ${progress === 100 ? "complete" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <Card title="Add a task">
        <TaskForm onAdd={addTask} />
      </Card>

      <Card title="Your tasks">
        <div className="toolbar">
          <Filter current={filter} onChange={setFilter} counts={counts} />
          <input
            className="search"
            type="search"
            placeholder="Search tasks"
            aria-label="Search tasks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <TaskList
          tasks={visibleTasks}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          emptyMessage={emptyMessage}
        />

        {doneCount > 0 && (
          <button className="ghost outlined clear" onClick={clearCompleted}>
            Clear {doneCount} completed
          </button>
        )}
      </Card>

      {undo && (
        <div className="toast" role="status">
          <span>Task deleted</span>
          <button onClick={undoDelete}>Undo</button>
        </div>
      )}
    </main>
  );
}