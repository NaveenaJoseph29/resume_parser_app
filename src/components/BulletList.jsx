// A plain bulleted list, or a note when there is nothing to show.
export default function BulletList({ items, emptyText }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyText}</p>;
  }
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
