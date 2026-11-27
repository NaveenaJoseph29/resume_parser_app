// A run of terms set inline in the text. The className decides the marking: `hl` for matches, `miss` for gaps.
export default function Chips({ items, className, emptyText = "None found." }) {
  if (items.length === 0) {
    return <p className="text-sm text-faint">{emptyText}</p>;
  }
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-3">
      {items.map((item) => (
        <span key={item} className={`text-base ${className}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
