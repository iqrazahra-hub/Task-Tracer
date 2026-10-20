// `children` is whatever you put between <Card> and </Card>.
// Default values using default parameters (the modern way).
export default function Card({ title = "Untitled", children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      <h2 className="card-title">{title}</h2>
      {children}
    </section>
  );
}

// Older way, shown for the task wording. Deprecated for function components
// and removed in React 19:
// Card.defaultProps = { title: "Untitled", className: "" };