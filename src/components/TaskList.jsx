import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onUpdate, onDelete, emptyMessage }) {
  if (tasks.length === 0) {
    return <p className="empty">{emptyMessage}</p>;
  }

  return (
    <ul className="list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}