// A row of pill-shaped labels. The colour classes decide whether they look good or bad.
export default function Chips({ items, className, emptyText = "None found." }) {
  if (items.length === 0) {
    return <p className="text-sm text-faint">{emptyText}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-full px-3 py-1 text-sm ${className}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
