export default function Card({ title = "Untitled", children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      <h2 className="card-title">{title}</h2>
      {children}
    </section>
  );
}

