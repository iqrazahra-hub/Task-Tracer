const OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "To do" },
  { value: "done", label: "Done" },
];

export default function Filter({ current, onChange, counts }) {
  return (
    <div className="segmented" role="group" aria-label="Filter tasks">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          aria-pressed={current === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label} <span className="count">{counts[opt.value]}</span>
        </button>
      ))}
    </div>
  );
}