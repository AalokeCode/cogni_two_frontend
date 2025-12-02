export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-lg p-6 
        ${
          hover
            ? "hover:border-zinc-700 hover:shadow-lg transition-all duration-200"
            : ""
        } 
        ${className}`}
    >
      {children}
    </div>
  );
}
