import { useEffect, useRef, useState } from "react";

const PRIORITIES = ["low", "medium", "high"];

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const priority = task.priority ?? "medium"; // older saved tasks have no priority
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [invalid, setInvalid] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef(null);

  // When edit mode turns on, focus the input and select its text.
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function startEdit() {
    setDraft(task.title);
    setInvalid(false);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    const t = draft.trim();
    if (t.length < 3 || t.length > 60) {
      setInvalid(true);
      return;
    }
    onUpdate(task.id, { title: t });
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  }

  function cyclePriority() {
    const next = PRIORITIES[(PRIORITIES.indexOf(priority) + 1) % PRIORITIES.length];
    onUpdate(task.id, { priority: next });
  }

  // Delete flow: play the slide-out animation first, then really delete.
  function handleAnimationEnd(e) {
    if (leaving && e.animationName === "slide-out") onDelete(task.id);
  }

  return (
    <li
      className={`item ${task.done ? "done" : ""} ${leaving ? "leaving" : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <button
        className={`dot ${priority}`}
        onClick={cyclePriority}
        aria-label={`Priority ${priority}. Click to change.`}
        title={`Priority: ${priority}`}
      />

      {editing ? (
        <div className="edit">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Edit task title"
            aria-invalid={invalid}
          />
          <button onClick={saveEdit}>Save</button>
          <button className="ghost" onClick={cancelEdit}>Cancel</button>
        </div>
      ) : (
        <>
          <label>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
            />
            <span onDoubleClick={startEdit}>{task.title}</span>
          </label>
          <div className="actions">
            <button className="ghost" onClick={startEdit}>Edit</button>
            <button className="ghost danger" onClick={() => setLeaving(true)}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}