import { useRef, useState } from "react";

const MAX = 60;
const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function validate(title) {
  const t = title.trim();
  if (!t) return "Enter a task title.";
  if (t.length < 3) return "Use at least 3 characters.";
  if (t.length > MAX) return `Keep it under ${MAX} characters.`;
  return "";
}

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null); // lets us focus the input from code

  function handleChange(e) {
    setTitle(e.target.value);
    if (touched) setError(validate(e.target.value));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const message = validate(title);
    setTouched(true);
    setError(message);
    if (message) return;
    onAdd(title.trim(), priority);
    setTitle("");
    setTouched(false);
    inputRef.current.focus(); // ready for the next task
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="task-title" className="sr-only">Task title</label>
      <input
        id="task-title"
        ref={inputRef}
        value={title}
        onChange={handleChange}
        placeholder="What needs doing?"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "task-error" : undefined}
      />
      <button type="submit">Add task</button>

      <div className="form-row">
        <div className="segmented" role="group" aria-label="Priority">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              aria-pressed={priority === p.value}
              onClick={() => setPriority(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className={`counter ${title.length > MAX ? "over" : ""}`}>
          {title.length}/{MAX}
        </span>
      </div>

      {error && <p id="task-error" className="error" role="alert">{error}</p>}
    </form>
  );
}